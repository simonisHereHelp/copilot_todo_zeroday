"use client"; // Indicates that this file is a client-side module

import { TodoItem } from "./TodoItem"; // Importing the TodoItem component
import { nanoid } from "nanoid"; // Importing the nanoid library for generating unique IDs
import { useState } from "react"; // Importing the useState hook from React
import { Todo } from "../types/todo"; // Importing the Todo type

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

// Defining the list of involved parties
const parties = ["Father", "Mother", "Children", "Elderlies"];

// Defining the TodoList component as a functional component
export const TodoList: React.FC = () => {
  // State to hold the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State to hold the current input value
  const [input, setInput] = useState("");
  // State to hold the selected party for the new todo
  const [selectedParty, setSelectedParty] = useState<string>("");

  useCopilotReadable({
    description: "做好 todo list.",
    value: todos,
  });

  // Define the "updateTodoList" action using the useCopilotAction function
  useCopilotAction({
    name: "updateTodoList",
    description: "Update the users todo list",
    parameters: [
      {
        name: "items",
        type: "object[]",
        description: "The new and updated todo list items.",
        attributes: [
          {
            name: "id",
            type: "string",
            description:
              "The id of the todo item. When creating a new todo item, just make up a new id.",
          },
          {
            name: "text",
            type: "string",
            description: "The text of the todo item.",
          },
          {
            name: "isCompleted",
            type: "boolean",
            description: "The completion status of the todo item.",
          },
          {
            name: "assignedTo",
            type: "string",
            description:
              "The person assigned to the todo item. If you don't know, assign it to 'YOU'.",
            required: true,
          },
        ],
      },
    ],
    handler: ({ items }) => {
      console.log(items);
      const newTodos = [...todos];

      for (const item of items) {
        const existingItemIndex = newTodos.findIndex(
          (todo) => todo.id === item.id
        );

        if (existingItemIndex !== -1) {
          newTodos[existingItemIndex] = item;
        } else {
          newTodos.push(item);
        }
      }

      setTodos(newTodos);
    },
    render: "Updating the todo list...",
  });

  useCopilotAction({
    name: "deleteTodo",
    description: "Delete a todo item",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the todo item to delete.",
      },
    ],
    handler: ({ id }) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    render: "Deleting a todo item...",
  });

  // Function to add a new todo
  const addTodo = () => {
    if (input.trim() !== "" && selectedParty !== "") {
      const newTodo: Todo = {
        id: nanoid(), // Generate a unique ID for the new todo
        text: input.trim(), // Trim the input text
        isCompleted: false, // Set the initial completion status to false
        assignedTo: selectedParty, // Assign the selected party
      };
      setTodos([...todos, newTodo]); // Add the new todo to the list
      setInput(""); // Clear the input field
      setSelectedParty(""); // Clear the selected party
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const assignPerson = (id: string, person: string | null) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, assignedTo: person ? person : undefined }
          : todo
      )
    );
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          className="border rounded-md p-2 flex-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update the input state on change
          onKeyDown={handleKeyPress} // Handle the Enter key press
        />
        <select
          className="border rounded-md p-2 mr-2"
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
        >
          <option value="">Select a party</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 rounded-md p-2 text-white"
          onClick={addTodo}
        >
          Add Todo
        </button>
      </div>
      {todos.length > 0 && (
        <div className="border rounded-lg">
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              assignPerson={assignPerson}
              hasBorder={index !== todos.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
