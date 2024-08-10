import Header from "./components/Header";
import { TodoList } from "./components/TodoList";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import "./globals.css"; // Assuming you're adding the CSS for background here.

export default function Home() {
  return (
    <>
      <Header />
      <div
        className="border rounded-md max-w-2xl mx-auto p-4 mt-4 bg-cover bg-center"
        style={{
          backgroundImage: `url('/src/app/zeroDay.webp')`,
        }}
      >
        <h1 className="text-2xl text-white font-bold mb-4">
          全家動員計劃 to-do list
        </h1>
        <CopilotKit runtimeUrl="/api/copilotkit">
          <TodoList />

          <CopilotPopup
            instructions={
              "Help the user manage a todo list. If the user provides a high level goal, " +
              "break it down into a few specific tasks and add them to the list"
            }
            defaultOpen={true}
            labels={{
              title: "具體的方法指示",
              initial: "👋 在這裡提問題，卡緊..呵呵",
            }}
            clickOutsideToClose={false}
          />
        </CopilotKit>
      </div>
    </>
  );
}
