import { AsyncLocalStorage } from "async_hooks";
import into from "draftlog";
import { clearInterval } from "timers";
into(console);

const draftCtx = new AsyncLocalStorage<Task>();

interface Step {
  name: string;
  startedAt: number;
}

export type TaskState =
  | "⌛"
  | "🚀"
  | "🛫"
  | "⏩"
  | "🟡"
  | "🟢"
  | "🔴"
  | (string & {});

interface Task {
  name: string;
  start: number;
  end: number | null;
  state: TaskState;
  steps: Step[];
  draftFn: (arg: string) => void;
}

export function createTask(name: string) {
  const draft = console.draft(name);
  const task = {
    name,
    start: performance.now(),
    end: null,
    state: "⌛",
    steps: [
      {
        name: "",
        startedAt: performance.now(),
      },
    ],
    draftFn: draft,
  } satisfies Task;

  allTasks.push(task);
  updateAll();
  print(task);

  draftCtx.enterWith(task);

  return () => draftCtx.enterWith(task);
}

const allTasks: Task[] = [];
let interval: null | NodeJS.Timeout = null;
function updateAll() {
  for (const task of allTasks) {
    print(task);
  }

  // Stop executing if we aren't
  if (allTasks.length == 0 && interval) {
    clearInterval(interval);
    interval = null;
  }

  if (allTasks.length > 0 && interval == null) {
    interval = setInterval(updateAll, 100);
  }
}

export function update(state: TaskState, name: string, done = false) {
  const taskCtx = draftCtx.getStore();
  if (!taskCtx) {
    return;
  }

  taskCtx.state = state;
  taskCtx.steps.push({
    name,
    startedAt: performance.now(),
  });

  if (done) {
    taskCtx.end = performance.now();
    const idx = allTasks.findIndex((a) => a == taskCtx);
    if (idx !== -1) {
      allTasks.splice(idx, 1);
    }
  }

  print(taskCtx);
}

function print(task: Task) {
  const el = (performance.now() - task.start) / 1000;
  const spinnerC = task.steps.length == 1 ? " " : task.end ? "✔" : spinner(el);

  const lastStep = task.steps[task.steps.length - 1];

  const res = `${spinnerC} ${task.state} | ${task.name}: ${lastStep.name}`;
  task.draftFn(res);
}

const spinnerSteps = "⠙⠹⠸⠼⠴⠦⠧⠇";
const spinsPerSecond = 1.0;
function spinner(el: number) {
  const spinnerStepNum =
    ((el * spinnerSteps.length * spinsPerSecond) | 0) % spinnerSteps.length;

  return spinnerSteps[spinnerStepNum];
}
