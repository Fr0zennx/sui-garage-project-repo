import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import './LessonView.css';

interface LessonViewProps {
  onClose: () => void;
}

interface Chapter {
  id: number;
  title: string;
  description: JSX.Element;
  initialCode: string;
  expectedCode: string;
  validate: (code: string) => { isValid: boolean; errors: Array<{ line: number, message: string }> };
}

const chapters: Chapter[] = [
  {
    id: 0,
    title: "Sui Garage",
    description: (
      <>
        <h2>Sui Garage</h2>
        <p>
          Welcome, Mechanic! You are about to embark on a journey to build the most advanced automotive empire on the Sui blockchain. In this garage, we don't just build cars; we create digital assets that you truly own.
        </p>

        <p>
          Before we add the engine or the nitro, we need a place to work. In the Move language, code is organized into <strong>Modules</strong>. Think of a module as your specialized workshop. It's a container that holds your data structures (cars, parts) and the functions (tuning, painting) that interact with them.
        </p>

        <p>
          Unlike other blockchains, Sui is <strong>object-centric</strong>. This means everything you build here—from a rusty old sedan to a supersonic race car—is an "Object" that lives in a user's wallet, not just a line in a ledger.
        </p>

        <h3>Key Concepts for this Chapter:</h3>
        <ul>
          <li><strong>The Module:</strong> Defined using the <code>module</code> keyword followed by <code>address::name</code>.</li>
          <li><strong>The Package:</strong> A collection of modules. The module name must match your package name in your Move.toml file.</li>
          <li><strong>Imports (use):</strong> Just like bringing tools into your workshop, we use the <code>use</code> keyword to bring in standard libraries (like <code>string</code> for our car names).</li>
        </ul>

        <h3>Put it to the test:</h3>
        <p>Let's set up our first workshop.</p>
        <ol>
          <li>Create a module named <code>car_factory</code> inside the address <code>sui_garage</code>.</li>
          <li>Inside the module, import the String library from the standard Move library so we can name our cars later. Use: <code>use std::string::&#123;String&#125;;</code></li>
        </ol>
      </>
    ),
    initialCode: `// Start your engine here!
module sui_garage::car_factory {
    
    // Your code here

}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if module declaration exists
      const hasModule = code.includes('module sui_garage::car_factory');
      if (!hasModule) {
        const moduleLine = lines.findIndex(l => l.trim().startsWith('module'));
        newErrors.push({
          line: moduleLine !== -1 ? moduleLine + 1 : 2,
          message: 'module name should be "sui_garage::car_factory"'
        });
      }

      // Check if use statement exists
      const hasUse = code.includes('use std::string::{String}');
      if (!hasUse) {
        const useLine = lines.findIndex(l => l.includes('use') || l.includes('// Your code here'));
        const lineNum = useLine !== -1 ? useLine + 1 : 4;
        newErrors.push({
          line: lineNum,
          message: 'missing import statement "use std::string::{String};"'
        });
      }

      // Normalize whitespace for comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '') // Remove comments
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 2,
    title: "Chapter 2: The Blueprint of a Machine (Structs & Abilities)",
    description: (
      <>
        <h2>Chapter 2: The Blueprint of a Machine (Structs & Abilities)</h2>
        <p>
          Now that we have our workshop (module), we need a blueprint for our cars. In Move, we define data structures using the <code>struct</code> keyword.
        </p>

        <p>
          However, a car in the Sui ecosystem isn't just a piece of data; it's a <strong>Sui Object</strong>. For a struct to become a Sui Object, it must possess certain "powers" called <strong>Abilities</strong>.
        </p>

        <h3>There are 4 types of abilities in Move:</h3>
        <ul>
          <li><strong>key:</strong> Allows the struct to be an object with a unique ID and be stored in the global storage.</li>
          <li><strong>store:</strong> Allows the struct to be stored inside other objects (like an engine inside a car).</li>
          <li><strong>copy:</strong> Allows the struct to be duplicated. (We won't use this for cars; every car should be unique!)</li>
          <li><strong>drop:</strong> Allows the struct to be discarded or destroyed at the end of a transaction.</li>
        </ul>

        <p>
          To make our car a true Sui asset, it must have the <code>key</code> ability and its first field must be a unique identifier (<code>id</code>) of type <code>UID</code>.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's define our Car blueprint.</p>
        <ol>
          <li>First, we need the identity tool. Import <code>UID</code> from the <code>sui::object</code> library.</li>
          <li>Create a struct named <code>Car</code>.</li>
          <li>Give it the <code>key</code> and <code>store</code> abilities (using the <code>has</code> keyword).</li>
          <li>Add these three fields inside the struct:
            <ul>
              <li><code>id</code>: Should be of type <code>UID</code>.</li>
              <li><code>model</code>: Should be of type <code>String</code>.</li>
              <li><code>speed</code>: Should be of type <code>u64</code> (Move's standard 64-bit integer).</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    // 1. Import UID here
    
    // 2. Define your Car struct below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{UID};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if UID is imported
      const hasUIDImport = code.includes('use sui::object::{UID}') || code.includes('use sui::object::UID');
      if (!hasUIDImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import UID here') || l.includes('use std::string'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 2 : 3,
          message: 'missing import statement "use sui::object::{UID};"'
        });
      }

      // Check if Car struct exists
      const hasCarStruct = code.includes('struct Car');
      if (!hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('// 2. Define your Car struct'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 2 : 5,
          message: 'missing struct definition "struct Car"'
        });
      }

      // Check if struct has key ability
      const hasKeyAbility = code.includes('has key');
      if (!hasKeyAbility && hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 1 : 5,
          message: 'Car struct must have "key" ability'
        });
      }

      // Check if struct has store ability
      const hasStoreAbility = code.includes('has key, store') || code.includes('has store, key');
      if (!hasStoreAbility && hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 1 : 5,
          message: 'Car struct must have "store" ability'
        });
      }

      // Check for id field
      const hasIdField = code.includes('id: UID');
      if (!hasIdField && hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 2 : 6,
          message: 'Car struct must have field "id: UID"'
        });
      }

      // Check for model field
      const hasModelField = code.includes('model: String');
      if (!hasModelField && hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 3 : 7,
          message: 'Car struct must have field "model: String"'
        });
      }

      // Check for speed field
      const hasSpeedField = code.includes('speed: u64');
      if (!hasSpeedField && hasCarStruct) {
        const structLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 4 : 8,
          message: 'Car struct must have field "speed: u64"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '') // Remove comments
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{UID};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 3,
    title: "Chapter 3: Starting the Assembly Line (Minting & Ownership)",
    description: (
      <>
        <h2>Chapter 3: Starting the Assembly Line (Minting & Ownership)</h2>
        <p>
          The blueprint is ready, but the garage is still empty. To bring a car to life, we need to "mint" it. In Move, minting simply means creating an instance of our struct and assigning it to an owner.
        </p>

        <p>
          In Sui, objects cannot just "exist" in a vacuum. <strong>Every object must have an owner</strong>. When we create a car, we usually want to send it to the person who triggered the transaction.
        </p>

        <h3>To achieve this, we will use two new tools:</h3>
        <ul>
          <li><strong>TxContext:</strong> This acts like the "ID card" of the current transaction. It tells us who is calling the function (<code>tx_context::sender</code>) and provides the ingredients to create a new unique ID.</li>
          <li><strong>sui::transfer:</strong> This is the delivery truck. Once the car is built, this module handles moving the object into the user's wallet.</li>
          <li><strong>The public entry Keyword:</strong> For a function to be callable directly from a wallet (like clicking a "Build Car" button in a game), it must be marked as <code>public entry</code>.</li>
        </ul>

        <h3>Put it to the test:</h3>
        <p>Let's write a function to build and deliver our first car.</p>
        <ol>
          <li>Import <code>sui::transfer</code> and <code>sui::tx_context::&#123;Self, TxContext&#125;</code>.</li>
          <li>Create a <code>public entry</code> function named <code>create_car</code>.</li>
          <li>The function should take two parameters: <code>model_name</code> (String) and <code>ctx</code> (a mutable reference to TxContext).</li>
          <li>Inside the function:
            <ul>
              <li>Create a new Car object.</li>
              <li>Use <code>object::new(ctx)</code> to generate its id.</li>
              <li>Set speed to a default value of 100.</li>
              <li>Use <code>transfer::transfer</code> to send the new car to the <code>tx_context::sender(ctx)</code>.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    // 1. Import transfer and tx_context here

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    // 2. Write your create_car function below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if transfer is imported
      const hasTransferImport = code.includes('use sui::transfer');
      if (!hasTransferImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import transfer'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 1 : 4,
          message: 'missing import statement "use sui::transfer;"'
        });
      }

      // Check if tx_context is imported
      const hasTxContextImport = code.includes('use sui::tx_context::{Self, TxContext}') ||
        code.includes('use sui::tx_context::{TxContext, Self}');
      if (!hasTxContextImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import transfer'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 1 : 5,
          message: 'missing import statement "use sui::tx_context::{Self, TxContext};"'
        });
      }

      // Check if create_car function exists
      const hasCreateCarFunction = code.includes('fun create_car');
      if (!hasCreateCarFunction) {
        const functionLine = lines.findIndex(l => l.includes('// 2. Write your create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 12,
          message: 'missing function "create_car"'
        });
      }

      // Check if function is public entry
      const isPublicEntry = code.includes('public entry fun create_car');
      if (!isPublicEntry && hasCreateCarFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 12,
          message: 'function must be "public entry fun create_car"'
        });
      }

      // Check for object::new(ctx)
      const hasObjectNew = code.includes('object::new(ctx)');
      if (!hasObjectNew && hasCreateCarFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 3 : 14,
          message: 'must use "object::new(ctx)" to create id'
        });
      }

      // Check for transfer::transfer
      const hasTransferCall = code.includes('transfer::transfer');
      if (!hasTransferCall && hasCreateCarFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 7 : 19,
          message: 'must use "transfer::transfer" to send the car'
        });
      }

      // Check for tx_context::sender
      const hasSender = code.includes('tx_context::sender(ctx)');
      if (!hasSender && hasCreateCarFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 7 : 19,
          message: 'must send car to "tx_context::sender(ctx)"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        transfer::transfer(new_car, tx_context::sender(ctx));
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 4,
    title: "Chapter 4: Tuning the Engine (References & Mutability)",
    description: (
      <>
        <h2>Chapter 4: Tuning the Engine (References & Mutability)</h2>
        <p>
          In the Move world, if you want to change an object's data (like upgrading a car's engine), you need to understand <strong>References</strong>.
        </p>

        <p>
          By default, Move is very strict about security. You cannot just change a value; you must prove to the network that you have the right to modify it. We do this using:
        </p>

        <ul>
          <li><strong>Read-only References (&):</strong> Use this when you just want to "look" at the data (e.g., checking the car's current speed).</li>
          <li><strong>Mutable References (&mut):</strong> Use this when you want to "change" the data (e.g., adding nitro to increase speed).</li>
        </ul>

        <p>
          In Sui, when a function takes a mutable reference to an object (like <code>car: &mut Car</code>), the network checks if the person calling the function is the actual owner of that car. If you don't own it, you can't tune it!
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's add a "Tune Up" station to our garage.</p>
        <ol>
          <li>Create a <code>public entry</code> function named <code>boost_speed</code>.</li>
          <li>The function should take two parameters:
            <ul>
              <li><code>car</code>: A mutable reference to our Car struct (<code>&mut Car</code>).</li>
              <li><code>amount</code>: A <code>u64</code> value representing how much speed to add.</li>
            </ul>
          </li>
          <li>Inside the function, update the car's speed by adding the <code>amount</code> to the current <code>car.speed</code>.</li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    // Write your boost_speed function below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if boost_speed function exists
      const hasBoostSpeedFunction = code.includes('fun boost_speed');
      if (!hasBoostSpeedFunction) {
        const commentLine = lines.findIndex(l => l.includes('// Write your boost_speed'));
        newErrors.push({
          line: commentLine !== -1 ? commentLine + 1 : 22,
          message: 'missing function "boost_speed"'
        });
      }

      // Check if function is public entry
      const isPublicEntry = code.includes('public entry fun boost_speed');
      if (!isPublicEntry && hasBoostSpeedFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 22,
          message: 'function must be "public entry fun boost_speed"'
        });
      }

      // Check for mutable reference parameter
      const hasMutRef = code.includes('car: &mut Car');
      if (!hasMutRef && hasBoostSpeedFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 22,
          message: 'first parameter must be "car: &mut Car"'
        });
      }

      // Check for amount parameter
      const hasAmountParam = code.includes('amount: u64');
      if (!hasAmountParam && hasBoostSpeedFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 22,
          message: 'second parameter must be "amount: u64"'
        });
      }

      // Check for speed update
      const hasSpeedUpdate = code.includes('car.speed = car.speed + amount') ||
        code.includes('car.speed = amount + car.speed') ||
        code.includes('car.speed += amount');
      if (!hasSpeedUpdate && hasBoostSpeedFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 23,
          message: 'must update car.speed by adding amount'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 5,
    title: "Chapter 5: The Used Car Market (Object Transfer)",
    description: (
      <>
        <h2>Chapter 5: The Used Car Market (Object Transfer)</h2>
        <p>
          In the Sui ecosystem, since you truly own your assets, you have the right to give or sell them to anyone you want. This process is called <strong>Transferring</strong>.
        </p>
        <p>
          Unlike other blockchains where you might just change a balance in a contract, in Sui, the entire object moves from your account to another person's account. Once a transfer is complete, you lose all access to that object, and the new owner gains full control.
        </p>

        <h3>We use the <code>sui::transfer</code> module for this:</h3>
        <ul>
          <li><strong><code>transfer::public_transfer</code>:</strong> We use this version when the object has the <code>store</code> ability (like our <code>Car</code>). It allows the object to be sent to any address.</li>
        </ul>

        <h3>Put it to the test:</h3>
        <p>Let's create a function that allows a garage owner to gift a car to a friend.</p>
        <ol>
          <li>Create a <code>public entry</code> function named <code>transfer_car</code>.</li>
          <li>The function should take two parameters:
            <ul>
              <li><code>car</code>: The <code>Car</code> object itself. (Note: Since we are moving the object entirely, we pass it by <strong>value</strong>, not by reference. This means we don't use <code>&</code>).</li>
              <li><code>recipient</code>: The <code>address</code> of the person who will receive the car.</li>
            </ul>
          </li>
          <li>Inside the function, use <code>transfer::public_transfer(car, recipient)</code> to complete the delivery.</li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    // Write your transfer_car function below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if transfer_car function exists
      const hasTransferFunction = code.includes('fun transfer_car');
      if (!hasTransferFunction) {
        const commentLine = lines.findIndex(l => l.includes('// Write your transfer_car'));
        newErrors.push({
          line: commentLine !== -1 ? commentLine + 1 : 26,
          message: 'missing function "transfer_car"'
        });
      }

      // Check if function is public entry
      const isPublicEntry = code.includes('public entry fun transfer_car');
      if (!isPublicEntry && hasTransferFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 26,
          message: 'function must be "public entry fun transfer_car"'
        });
      }

      // Check for car parameter (by value)
      const hasCarParam = code.includes('car: Car');
      const hasRefCar = code.includes('car: &Car') || code.includes('car: &mut Car');
      if (hasRefCar && hasTransferFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 26,
          message: 'car must be passed by value ("car: Car"), not by reference'
        });
      } else if (!hasCarParam && hasTransferFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 26,
          message: 'missing parameter "car: Car"'
        });
      }

      // Check for recipient parameter
      const hasRecipientParam = code.includes('recipient: address');
      if (!hasRecipientParam && hasTransferFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 26,
          message: 'missing parameter "recipient: address"'
        });
      }

      // Check for public_transfer usage
      const hasPublicTransfer = code.includes('transfer::public_transfer(car, recipient)');
      if (!hasPublicTransfer && hasTransferFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun transfer_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 27,
          message: 'must use "transfer::public_transfer(car, recipient)"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 6,
    title: "Chapter 6: Scrapping the Junk (Object Deletion)",
    description: (
      <>
        <h2>Chapter 6: Scrapping the Junk (Object Deletion)</h2>
        <p>
          Not every car stays on the road forever. Sometimes, a car is just too old or damaged. In Sui, you have the ability to destroy an object and remove it from the blockchain entirely. This process is called <strong>Unpacking</strong>.
        </p>
        <p>
          To destroy an object, you must follow these rules:
        </p>

        <ol>
          <li><strong>Ownership:</strong> You must own the object to destroy it.</li>
          <li><strong>Unpacking:</strong> In Move, you "deconstruct" the struct. You take all the fields out and handle them individually.</li>
          <li><strong>UID Deletion:</strong> Since every Sui object has a unique <code>id</code> of type <code>UID</code>, you must explicitly delete this ID using <code>object::delete</code>. If you don't delete the ID, the code won't compile—Move won't let you leave a "ghost" ID behind!</li>
        </ol>

        <h3>Put it to the test:</h3>
        <p>Let's add a "Scrapyard" function to our garage.</p>
        <ol>
          <li>Create a <code>public entry</code> function named <code>scrap_car</code>.</li>
          <li>The function should take one parameter: <code>car: Car</code>. (Remember: We pass it by <strong>value</strong> because we are going to destroy it).</li>
          <li>Inside the function:
            <ul>
              <li>Use "destructuring" to unpack the car: <code>let Car &#123; id, model: _, speed: _ &#125; = car;</code>. (The <code>_</code> means we don't care about the value of the model or speed).</li>
              <li>Use <code>object::delete(id)</code> to permanently remove the car's identity from the blockchain.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    // Write your scrap_car function below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check if scrap_car function exists
      const hasScrapFunction = code.includes('fun scrap_car');
      if (!hasScrapFunction) {
        const commentLine = lines.findIndex(l => l.includes('// Write your scrap_car'));
        newErrors.push({
          line: commentLine !== -1 ? commentLine + 1 : 30,
          message: 'missing function "scrap_car"'
        });
      }

      // Check if function is public entry
      const isPublicEntry = code.includes('public entry fun scrap_car');
      if (!isPublicEntry && hasScrapFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 30,
          message: 'function must be "public entry fun scrap_car"'
        });
      }

      // Check for car parameter (by value)
      const hasCarParam = code.includes('car: Car');
      const hasRefCar = code.includes('car: &Car') || code.includes('car: &mut Car');
      if (hasRefCar && hasScrapFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 30,
          message: 'car must be passed by value ("car: Car"), not by reference'
        });
      } else if (!hasCarParam && hasScrapFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 30,
          message: 'missing parameter "car: Car"'
        });
      }

      // Check for destructuring
      const hasDestructuring = code.includes('let Car {') || code.includes('let Car{');
      if (!hasDestructuring && hasScrapFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 31,
          message: 'must unpack struct: "let Car { id, model: _, speed: _ } = car;"'
        });
      }

      // Check for object::delete
      const hasDelete = code.includes('object::delete(id)');
      if (!hasDelete && hasScrapFunction) {
        const functionLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 3 : 32,
          message: 'must delete the UID with "object::delete(id)"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 7,
    title: "Chapter 7: The Master Key (Admin Capabilities)",
    description: (
      <>
        <h2>Chapter 7: The Master Key (Admin Capabilities)</h2>
        <p>
          In your garage, you don't want just anyone to be able to access the high-end nitro boosts. You need a system to distinguish between a regular user and the <strong>Garage Owner</strong>.
        </p>

        <p>
          In Move, we use a pattern called the <strong>Capability Pattern</strong>. Instead of checking a list of "allowed addresses" (which is expensive and slow), we create a special, unique object—like a "Golden Key"—and give it to the admin.
        </p>

        <h3>How it works:</h3>
        <ol>
          <li>We define a struct called <code>AdminCap</code> (Admin Capability).</li>
          <li>We create this object only once, during the module's initialization.</li>
          <li>In functions that should be restricted, we add <code>&AdminCap</code> as a required parameter.</li>
        </ol>

        <p>
          Since only the admin has this "Golden Key" in their wallet, no one else can call those specific functions!
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's restrict the <code>boost_speed</code> function so only the owner can use it.</p>
        <ol>
          <li>Define a new struct named <code>AdminCap</code>. It must have the <code>key</code> ability and contain an <code>id: UID</code>.</li>
          <li>Update the <code>boost_speed</code> function from Chapter 4. Add a new first parameter: <code>_cap: &AdminCap</code>. (We use the underscore <code>_</code> because we only need to prove the key exists; we don't need to read data from it).</li>
          <li>Now, to call <code>boost_speed</code>, the user MUST provide their <code>AdminCap</code> object along with the <code>Car</code>.</li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // 1. Define AdminCap struct here
    

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    // 2. Update this function to require AdminCap
    public entry fun boost_speed(car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check for AdminCap struct
      const hasAdminCap = code.includes('struct AdminCap has key');
      if (!hasAdminCap) {
        const structLine = lines.findIndex(l => l.includes('// 1. Define AdminCap'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 2 : 6,
          message: 'missing struct definition "struct AdminCap has key"'
        });
      }

      // Check boost_speed signature
      const hasCapParam = code.includes('_cap: &AdminCap') || code.includes('cap: &AdminCap');
      if (!hasCapParam) {
        const functionLine = lines.findIndex(l => l.includes('fun boost_speed'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 16,
          message: 'boost_speed must take "_cap: &AdminCap" as first parameter'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 8,
    title: "Chapter 8: Opening Day (The init Function)",
    description: (
      <>
        <h2>Chapter 8: Opening Day (The <code>init</code> Function)</h2>
        <p>
          Every great garage has a grand opening. In Sui Move, we use a special function called <code>init</code> to handle everything that needs to happen the moment your code is published to the blockchain.
        </p>

        <h3>Rules of the <code>init</code> function:</h3>
        <ol>
          <li><strong>Automatic Execution:</strong> It runs only once, and only at the moment of deployment.</li>
          <li><strong>Special Signature:</strong> It must be named exactly <code>init</code>.</li>
          <li><strong>Parameters:</strong> It can only take a <code>&mut TxContext</code> (mandatory) or a <code>OneTimeWitness</code> (optional, for advanced cases). It cannot be called by users later.</li>
          <li><strong>Visibility:</strong> It must be a private function (no <code>public</code> or <code>entry</code> keywords).</li>
        </ol>

        <p>
          This is the perfect place to create our <strong>AdminCap</strong> (Master Key) and send it to the person who deployed the contract (the owner). This ensures that the person who pays for the deployment becomes the boss of the garage.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's set up the automatic delivery of the Master Key.</p>
        <ol>
          <li>Create a private function named <code>init</code>.</li>
          <li>It should take one parameter: <code>ctx: &mut TxContext</code>.</li>
          <li>Inside the function:
            <ul>
              <li>Create a new <code>AdminCap</code> object.</li>
              <li>Use <code>object::new(ctx)</code> for its ID.</li>
              <li>Use <code>transfer::transfer</code> to send the <code>AdminCap</code> to the <code>tx_context::sender(ctx)</code>.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    // 1. Write your init function here
    

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check for init function
      const hasInit = code.includes('fun init');
      if (!hasInit) {
        const commentLine = lines.findIndex(l => l.includes('// 1. Write your init function'));
        newErrors.push({
          line: commentLine !== -1 ? commentLine + 2 : 14,
          message: 'missing "fun init(ctx: &mut TxContext)"'
        });
      }

      // Check init is NOT public
      const isPublicInit = code.includes('public fun init') || code.includes('public entry fun init');
      if (isPublicInit) {
        const functionLine = lines.findIndex(l => l.includes('fun init'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 14,
          message: 'init function must be private (remove "public" or "entry")'
        });
      }

      // Check AdminCap creation
      const hasCapCreation = code.includes('AdminCap {') && code.includes('object::new(ctx)');
      if (!hasCapCreation && hasInit) {
        const functionLine = lines.findIndex(l => l.includes('fun init'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 15,
          message: 'must create AdminCap with object::new(ctx)'
        });
      }

      // Check transfer
      const hasTransfer = code.includes('transfer::transfer') && code.includes('tx_context::sender(ctx)');
      if (!hasTransfer && hasInit) {
        const functionLine = lines.findIndex(l => l.includes('fun init'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 3 : 18,
          message: 'must transfer AdminCap to sender(ctx)'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 9,
    title: "Chapter 9: The Global Dashboard (Shared Objects)",
    description: (
      <>
        <h2>Chapter 9: The Global Dashboard (Shared Objects)</h2>
        <p>
          Until now, every object we created (Cars, AdminCap) was an <strong>Owned Object</strong>. Only the owner could see or modify them. But what if we want a "Global Counter" that tracks how many cars have been built in total?
        </p>

        <p>
          In Sui, we can make an object accessible to everyone by making it a <strong>Shared Object</strong>.
        </p>

        <h3>Owned vs. Shared:</h3>
        <ul>
          <li><strong>Owned:</strong> Only the owner can use it in a transaction. (Your car in your wallet).</li>
          <li><strong>Shared:</strong> Anyone can use it in a transaction. (A public vending machine or a global counter).</li>
        </ul>

        <p>
          To share an object, we use <code>transfer::share_object(obj)</code>. Once an object is shared, it stays shared forever; it cannot be "un-shared" or moved into a private wallet.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's create a <code>GarageStats</code> object that counts every car produced.</p>
        <ol>
          <li>Create a new <code>struct</code> named <code>GarageStats</code>. It must have the <code>key</code> ability and contain <code>id: UID</code> and <code>total_cars: u64</code>.</li>
          <li>In the <code>init</code> function, create an instance of <code>GarageStats</code> with <code>total_cars</code> set to <code>0</code>.</li>
          <li>Use <code>transfer::share_object</code> to make this <code>GarageStats</code> object public to the entire network.</li>
          <li>Update the <code>create_car</code> function:
            <ul>
              <li>Add a new parameter: <code>stats: &mut GarageStats</code>.</li>
              <li>Inside the function, increment <code>stats.total_cars</code> by 1 (<code>stats.total_cars = stats.total_cars + 1</code>).</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    // 1. Define GarageStats struct here
    

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // 2 & 3. Initialize and share GarageStats here
        
    }

    // 4. Update create_car to accept GarageStats
    public entry fun create_car(model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check for GarageStats struct
      const hasStatsStruct = code.includes('struct GarageStats has key');
      if (!hasStatsStruct) {
        const commentLine = lines.findIndex(l => l.includes('// 1. Define GarageStats'));
        newErrors.push({
          line: commentLine !== -1 ? commentLine + 2 : 8,
          message: 'missing "struct GarageStats has key" definition'
        });
      }

      // Check share_object
      const hasShare = code.includes('transfer::share_object');
      if (!hasShare) {
        const initLine = lines.findIndex(l => l.includes('fun init'));
        newErrors.push({
          line: initLine !== -1 ? initLine + 4 : 20,
          message: 'must use "transfer::share_object" in init'
        });
      }

      // Check create_car signature
      const hasStatsParam = code.includes('stats: &mut GarageStats');
      if (!hasStatsParam) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 1 : 28,
          message: 'create_car must take "stats: &mut GarageStats" as first parameter'
        });
      }

      // Check increment
      const hasIncrement = code.includes('stats.total_cars = stats.total_cars + 1') || code.includes('stats.total_cars += 1');
      if (!hasIncrement && hasStatsParam) {
        const functionLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 29,
          message: 'must increment stats.total_cars'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;

        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 10,
    title: "Chapter 10: The Custom Paint Job (Dynamic Fields)",
    description: (
      <>
        <h2>Chapter 10: The Custom Paint Job (Dynamic Fields)</h2>
        <p>
          In standard programming, once a <code>struct</code> is defined, you cannot add new fields to it. If our <code>Car</code> doesn't have a <code>color</code> field, it's stuck without one forever... unless we use <strong>Dynamic Fields</strong>.
        </p>

        <p>
          Dynamic Fields allow you to attach "sub-objects" or extra data to an existing object. Think of it like a sticker or a physical upgrade you bolt onto your car.
        </p>

        <h3>Why use Dynamic Fields?</h3>
        <ul>
          <li><strong>Flexibility:</strong> Add features to an object after it has been created.</li>
          <li><strong>Scalability:</strong> You can add an unlimited number of fields without making the main object "heavy" or expensive to load.</li>
        </ul>

        <p>
          In this chapter, we will add a "Paint" feature. We will use the <code>sui::dynamic_field</code> module to attach a color name to our car.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's allow our mechanics to give cars a custom paint job.</p>
        <ol>
          <li>Import <code>sui::dynamic_field</code> as <code>df</code>.</li>
          <li>Create a <code>public entry</code> function named <code>add_paint</code>.</li>
          <li>The function should take two parameters:
            <ul>
              <li><code>car</code>: A mutable reference to our <code>Car</code> (<code>&mut Car</code>).</li>
              <li><code>color</code>: A <code>String</code> representing the new color.</li>
            </ul>
          </li>
          <li>Inside the function, use <code>df::add</code> to attach the paint:
            <ul>
              <li>The first argument is the parent's ID: <code>&mut car.id</code>.</li>
              <li>The second argument is the field name (a key): use a string literal like <code>b"paint_color"</code>.</li>
              <li>The third argument is the value: the <code>color</code> string.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    // 1. Import dynamic_field here
    

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    // 2. Write your add_paint function below
    
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check import
      const hasImport = code.includes('use sui::dynamic_field as df');
      if (!hasImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import dynamic_field'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 2 : 5,
          message: 'missing import "use sui::dynamic_field as df;"'
        });
      }

      // Check add_paint function
      const hasAddPaint = code.includes('fun add_paint');
      if (!hasAddPaint) {
        const functionLine = lines.findIndex(l => l.includes('// 2. Write your add_paint'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 58,
          message: 'missing "public entry fun add_paint"'
        });
      }

      // Check df::add
      const hasDfAdd = code.includes('df::add(&mut car.id, b"paint_color", color)');
      if (!hasDfAdd && hasAddPaint) {
        const functionLine = lines.findIndex(l => l.includes('fun add_paint'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 59,
          message: 'must use "df::add(&mut car.id, b"paint_color", color)"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        df::add(&mut car.id, b"paint_color", color);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 11,
    title: "Chapter 11: Checking the Specs (Assertions & Existence)",
    description: (
      <>
        <h2>Chapter 11: Checking the Specs (Assertions & Existence)</h2>
        <p>
          A professional mechanic always checks the car before starting a job. In Move, we use <strong>Assertions</strong> to ensure our logic stays safe and doesn't crash the transaction unexpectedly.
        </p>

        <p>
          In the previous chapter, we added a paint color. But what if the car is already painted? If you try to <code>df::add</code> a field that already exists with the same name, the transaction will fail. To prevent this, we need to check if the field exists first.
        </p>

        <h3>Key Tools:</h3>
        <ul>
          <li><strong><code>df::exists_</code>:</strong> Returns <code>true</code> if a dynamic field with that name exists on the object.</li>
          <li><strong><code>assert!</code>:</strong> A macro that checks a condition. If the condition is <code>false</code>, it stops the transaction and returns a specific <strong>Error Code</strong>.</li>
        </ul>

        <p>Error codes are usually defined as constants (e.g., <code>const EFieldAlreadyExists: u64 = 0;</code>).</p>

        <h3>Put it to the test:</h3>
        <p>Let's upgrade our <code>add_paint</code> function to be "smart."</p>
        <ol>
          <li>Define a constant named <code>EPaintAlreadyExists</code> with the value <code>1</code>.</li>
          <li>Update the <code>add_paint</code> function:
            <ul>
              <li>Before adding the paint, use <code>df::exists_(&car.id, b"paint_color")</code> to check if the car is already painted.</li>
              <li>Use <code>assert!</code> to ensure the field <strong>does NOT</strong> exist. If it does, throw the <code>EPaintAlreadyExists</code> error.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    // 1. Define your constant error code here
    

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        // 2. Add your existence check and assert! here
        
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check error constant
      const hasErrorConst = code.includes('const EPaintAlreadyExists: u64 = 1');
      if (!hasErrorConst) {
        const errorLine = lines.findIndex(l => l.includes('// 1. Define your constant'));
        newErrors.push({
          line: errorLine !== -1 ? errorLine + 2 : 7,
          message: 'missing "const EPaintAlreadyExists: u64 = 1;"'
        });
      }

      // Check df::exists_
      const hasExists = code.includes('df::exists_(&car.id, b"paint_color")');
      if (!hasExists) {
        const functionLine = lines.findIndex(l => l.includes('fun add_paint'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 2 : 60,
          message: 'must use "df::exists_(&car.id, b"paint_color")"'
        });
      }

      // Check assert!
      const hasAssert = code.includes('assert!') && code.includes('EPaintAlreadyExists');
      if (!hasAssert) {
        const functionLine = lines.findIndex(l => l.includes('fun add_paint'));
        newErrors.push({
          line: functionLine !== -1 ? functionLine + 3 : 61,
          message: 'must use "assert!" with "EPaintAlreadyExists"'
        });
      }

      // Normalize whitespace for final comparison
      const normalizeCode = (str: string) =>
        str.replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

      const userCode = normalizeCode(code);
      const expected = normalizeCode(`module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`);

      if (newErrors.length === 0 && userCode !== expected) {
        newErrors.push({
          line: 1,
          message: 'syntax error: check your code structure'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 12,
    title: "Chapter 12: The Fleet Manager (Table Structure)",
    description: (
      <>
        <h2>Chapter 12: The Fleet Manager (Table Structure)</h2>
        <p>
          As your garage expands, you need a way to organize your fleet. If you store 10,000 car IDs in a simple list (<code>vector</code>), every time you want to find a car, the network has to scan the whole list. This is slow and expensive!
        </p>

        <p>
          Sui provides the <code>sui::table</code> module for high-performance data storage. A <strong>Table</strong> works like a dictionary: you give it a unique Key (like a Car ID) and it quickly gives you the Value (like the Owner's address).
        </p>

        <h3>Key Features of Table:</h3>
        <ul>
          <li><strong>Fixed Cost:</strong> Accessing the 1st or the 1,000,000th item costs the same amount of gas.</li>
          <li><strong>Storage:</strong> The data is stored "outside" the main object, keeping your parent object "light."</li>
          <li><strong>Strict Typing:</strong> You must define what type the Key and the Value will be when you create the table.</li>
        </ul>

        <p>
          In this chapter, we will add a global "Fleet Registry" to our <code>GarageStats</code> to map every Car ID to its model name.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's integrate a high-performance registry into our garage.</p>
        <ol>
          <li>Import <code>sui::table::&#123;Self, Table&#125;</code>.</li>
          <li>Update the <code>GarageStats</code> struct:
            <ul>
              <li>Add a new field: <code>registry: Table&lt;ID, String&gt;</code>. (Note: You need to import <code>sui::object::ID</code>).</li>
            </ul>
          </li>
          <li>Update the <code>init</code> function:
            <ul>
              <li>When creating <code>GarageStats</code>, initialize the table using <code>table::new&lt;ID, String&gt;(ctx)</code>.</li>
            </ul>
          </li>
          <li>Update the <code>create_car</code> function:
            <ul>
              <li>After creating a new car, add it to the registry: <code>table::add(&mut stats.registry, object::id(&new_car), model_name)</code>.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    // 1. Import Table here
    

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        // 2. Add registry field here
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // 3. Initialize the table inside GarageStats
        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        // 4. Add the car to the registry table here

        stats.total_cars = stats.total_cars + 1;
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        table::add(&mut stats.registry, object::id(&new_car), model_name);

        stats.total_cars = stats.total_cars + 1;
        transfer::transfer(new_car, tx_context::sender(ctx));
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check Table import
      const hasTableImport = code.includes('use sui::table::{Self, Table}');
      if (!hasTableImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import Table'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 2 : 6,
          message: 'missing import "use sui::table::{Self, Table}"'
        });
      }

      // Check registry field
      const hasRegistry = code.includes('registry: Table<ID, String>');
      if (!hasRegistry) {
        const structLine = lines.findIndex(l => l.includes('struct GarageStats'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 4 : 15,
          message: 'missing "registry: Table<ID, String>" in GarageStats'
        });
      }

      // Check table initialization
      const hasInitTable = code.includes('registry: table::new<ID, String>(ctx)');
      if (!hasInitTable) {
        const initLine = lines.findIndex(l => l.includes('fun init'));
        newErrors.push({
          line: initLine !== -1 ? initLine + 6 : 30,
          message: 'must initialize table with "table::new<ID, String>(ctx)"'
        });
      }

      // Check table::add
      const hasTableAdd = code.includes('table::add(&mut stats.registry, object::id(&new_car), model_name)');
      if (!hasTableAdd) {
        const createLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: createLine !== -1 ? createLine + 8 : 45,
          message: 'must add to registry using "table::add"'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 13,
    title: "Chapter 13: Radio Signals (Events)",
    description: (
      <>
        <h2>Chapter 13: Radio Signals (Events)</h2>
        <p>
          When a transaction happens on the blockchain, your frontend (website) needs a way to know it was successful without constantly refreshing the page. In Move, we achieve this using <strong>Events</strong>.
        </p>

        <p>
          Events are lightweight notifications emitted during a transaction. They don't stay in the "active" storage of the blockchain (so they are very cheap), but they are indexed by full nodes so that apps can listen to them.
        </p>

        <h3>How to use Events:</h3>
        <ol>
          <li><strong>Define:</strong> Create a <code>struct</code> with the <code>copy</code> and <code>drop</code> abilities. (Events don't need IDs because they are not persistent objects).</li>
          <li><strong>Emit:</strong> Use the <code>sui::event::emit</code> function to broadcast the data.</li>
        </ol>

        <p>
          In this chapter, we will broadcast a signal every time a new car is created so the whole world can see our garage's progress!
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's set up our garage's radio broadcast system.</p>
        <ol>
          <li>Import <code>sui::event</code>.</li>
          <li>Define a new <code>struct</code> named <code>CarCreated</code>. It should have <code>copy</code> and <code>drop</code> abilities.</li>
          <li>Add two fields to <code>CarCreated</code>:
            <ul>
              <li><code>car_id: ID</code></li>
              <li><code>owner: address</code></li>
            </ul>
          </li>
          <li>Update the <code>create_car</code> function:
            <ul>
              <li>At the end of the function, use <code>event::emit</code> to send a <code>CarCreated</code> signal containing the new car's ID and the sender's address.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    // 1. Import event here
    
    // 2 & 3. Define CarCreated event struct here


    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        
        stats.total_cars = stats.total_cars + 1;
        
        // 4. Emit the CarCreated event here


        transfer::transfer(new_car, sender);
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    use sui::event;
    use sui::bag::{Self, Bag};

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        
        stats.total_cars = stats.total_cars + 1;
        
        event::emit(CarCreated {
            car_id,
            owner: sender,
        });

        transfer::transfer(new_car, sender);
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _ } = car;
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check event import
      const hasEventImport = code.includes('use sui::event');
      if (!hasEventImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import event'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 2 : 7,
          message: 'missing import "use sui::event;"'
        });
      }

      // Check CarCreated struct
      const hasStruct = code.includes('struct CarCreated has copy, drop');
      if (!hasStruct) {
        const structLine = lines.findIndex(l => l.includes('// 2 & 3. Define CarCreated'));
        newErrors.push({
          line: structLine !== -1 ? structLine + 2 : 10,
          message: 'missing "struct CarCreated has copy, drop"'
        });
      }

      // Check event::emit
      const hasEmit = code.includes('event::emit');
      if (!hasEmit) {
        const createLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: createLine !== -1 ? createLine + 18 : 65,
          message: 'must use "event::emit" to broadcast the event'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 14,
    title: "Chapter 14: The Garage Bag (Heterogeneous Collections)",
    description: (
      <>
        <h2>Chapter 14: The Garage Bag (Heterogeneous Collections)</h2>
        <p>
          Imagine you want to store "Maintenance Equipment" for your cars. Some cars might have a <code>SpareTire</code> object, others a <code>ToolBox</code> object, and some might just have a simple <code>u64</code> representing a serial number.
        </p>

        <p>
          If you used a <code>Table</code>, you would be stuck with one type of value. But Sui offers the <code>sui::bag</code> module for these situations. A <strong>Bag</strong> is like a physical duffel bag: you can throw anything that has the <code>store</code> ability inside it, regardless of its type.
        </p>

        <h3>Bag vs. Table:</h3>
        <ul>
          <li><strong>Table:</strong> Homogeneous (All values must be the same type). Fast and efficient for large lists.</li>
          <li><strong>Bag:</strong> Heterogeneous (Values can be different types, e.g., a <code>u64</code>, a <code>String</code>, and a <code>struct</code> can all live in the same Bag).</li>
        </ul>

        <p>
          In this chapter, we will add a "Trunk" (Bagaj) to our <code>Car</code> struct so owners can store various accessories inside their cars.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's give our cars a flexible storage space.</p>
        <ol>
          <li>Import <code>sui::bag::&#123;Self, Bag&#125;</code>.</li>
          <li>Update the <code>Car</code> struct:
            <ul>
              <li>Add a new field: <code>trunk: Bag</code>.</li>
            </ul>
          </li>
          <li>Update the <code>create_car</code> function:
            <ul>
              <li>When creating the <code>Car</code>, initialize the <code>trunk</code> using <code>bag::new(ctx)</code>.</li>
            </ul>
          </li>
          <li>Update the <code>scrap_car</code> function:
            <ul>
              <li>Since <code>Bag</code> does not have <code>drop</code>, you must destroy it using <code>bag::destroy_empty(trunk)</code> before deleting the car ID.</li>
            </ul>
          </li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    use sui::event;
    // 1. Import Bag here
    

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        // 2. Add trunk field here
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100,
            // 3. Initialize trunk here
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        
        stats.total_cars = stats.total_cars + 1;
        
        event::emit(CarCreated {
            car_id,
            owner: sender,
        });

        transfer::transfer(new_car, sender);
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        
        // 4. Destroy the empty bag here before deleting ID
        
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    use sui::event;
    use sui::bag::{Self, Bag};

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        trunk: Bag
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public entry fun create_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext) {
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100,
            trunk: bag::new(ctx)
        };

        let car_id = object::id(&new_car);
        let sender = tx_context::sender(ctx);

        table::add(&mut stats.registry, car_id, model_name);
        
        stats.total_cars = stats.total_cars + 1;
        
        event::emit(CarCreated {
            car_id,
            owner: sender,
        });

        transfer::transfer(new_car, sender);
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        bag::destroy_empty(trunk);
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check Bag import
      const hasBagImport = code.includes('use sui::bag::{Self, Bag}');
      if (!hasBagImport) {
        const importLine = lines.findIndex(l => l.includes('// 1. Import Bag'));
        newErrors.push({
          line: importLine !== -1 ? importLine + 2 : 8,
          message: 'missing import "use sui::bag::{Self, Bag}"'
        });
      }

      // Check trunk field
      const hasTrunk = code.includes('trunk: Bag');
      if (!hasTrunk) {
        const carLine = lines.findIndex(l => l.includes('struct Car'));
        newErrors.push({
          line: carLine !== -1 ? carLine + 5 : 30,
          message: 'missing "trunk: Bag" field in Car struct'
        });
      }

      // Check bag new
      const hasBagNew = code.includes('trunk: bag::new(ctx)');
      if (!hasBagNew) {
        const createLine = lines.findIndex(l => l.includes('fun create_car'));
        newErrors.push({
          line: createLine !== -1 ? createLine + 6 : 60,
          message: 'must initialize trunk with "bag::new(ctx)"'
        });
      }

      // Check bag destroy
      const hasBagDestroy = code.includes('bag::destroy_empty(trunk)');
      if (!hasBagDestroy) {
        const scrapLine = lines.findIndex(l => l.includes('fun scrap_car'));
        newErrors.push({
          line: scrapLine !== -1 ? scrapLine + 3 : 110,
          message: 'must destroy empty bag with "bag::destroy_empty(trunk)"'
        });
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  },
  {
    id: 15,
    title: "Chapter 15: The Grand Finale (Composability & PTB)",
    description: (
      <>
        <h2>Chapter 15: The Grand Finale (Composability & PTB)</h2>
        <p>
          Congratulations! You’ve built a complete garage system. But there is one final secret to Sui's power: <strong>Programmable Transaction Blocks (PTB)</strong>.
        </p>
        <p>
          In other blockchains, if you want to buy a car, tune it, and then send it to a friend, you might need 3 separate transactions. In Sui, you can do all of this in <strong>one single block</strong>. To make your module "PTB-friendly," your functions should be composable.
        </p>
        <p>
          <strong>What is Composability?</strong><br />
          Instead of having a function that always transfers the object to the sender (using <code>transfer::transfer</code>), we create a function that <strong>returns</strong> the object. This allows another function in the same transaction block to take that car and do something else with it immediately.
        </p>
        <p>
          In this final lesson, we will create a "Professional Assembly" function. Instead of delivering the car to a wallet, it will return the <code>Car</code> object to the caller.
        </p>

        <h3>Put it to the test:</h3>
        <p>Let's make our car factory modular.</p>
        <ol>
          <li>Create a <code>public</code> function (not <code>entry</code>) named <code>build_car</code>.
            <ul>
              <li><em>Note:</em> <code>entry</code> functions cannot return values to other Move functions, but <code>public</code> functions can!</li>
            </ul>
          </li>
          <li>The function should take the same parameters as before: <code>stats</code>, <code>model_name</code>, and <code>ctx</code>.</li>
          <li>Inside the function:
            <ul>
              <li>Increment the <code>stats.total_cars</code>.</li>
              <li>Create the <code>Car</code> object (don't forget the <code>trunk</code>).</li>
              <li><strong>Crucial Step:</strong> Do NOT use <code>transfer::transfer</code>. Instead, simply return the <code>new_car</code> at the end of the function.</li>
            </ul>
          </li>
          <li>Specify the return type in the function signature: <code>public fun build_car(...): Car</code>.</li>
        </ol>
      </>
    ),
    initialCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    use sui::event;
    use sui::bag::{Self, Bag};

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        trunk: Bag
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    // 1. Create the composable build_car function
    // Hint: Use 'public fun' instead of 'public entry fun'
    // Hint: It should return a Car object
    public fun build_car(
        stats: &mut GarageStats, 
        model_name: String, 
        ctx: &mut TxContext
    ): Car { 
        
        // 2. Logic here (increment stats, create car)
        
        // 3. Return the car
        
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        bag::destroy_empty(trunk);
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    expectedCode: `module sui_garage::car_factory {
    use std::string::{String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::dynamic_field as df;
    use sui::table::{Self, Table};
    use sui::event;
    use sui::bag::{Self, Bag};

    struct CarCreated has copy, drop {
        car_id: ID,
        owner: address
    }

    const EPaintAlreadyExists: u64 = 1;

    struct AdminCap has key {
        id: UID
    }

    struct GarageStats has key {
        id: UID,
        total_cars: u64,
        registry: Table<ID, String>
    }

    struct Car has key, store {
        id: UID,
        model: String,
        speed: u64,
        trunk: Bag
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        transfer::share_object(GarageStats {
            id: object::new(ctx),
            total_cars: 0,
            registry: table::new<ID, String>(ctx)
        });
    }

    public fun build_car(stats: &mut GarageStats, model_name: String, ctx: &mut TxContext): Car {
        stats.total_cars = stats.total_cars + 1;
        
        let new_car = Car {
            id: object::new(ctx),
            model: model_name,
            speed: 100,
            trunk: bag::new(ctx)
        };

        let car_id = object::id(&new_car);
        table::add(&mut stats.registry, car_id, model_name);
        
        new_car
    }

    public entry fun boost_speed(_cap: &AdminCap, car: &mut Car, amount: u64) {
        car.speed = car.speed + amount;
    }

    public entry fun transfer_car(car: Car, recipient: address) {
        transfer::public_transfer(car, recipient);
    }

    public entry fun scrap_car(car: Car) {
        let Car { id, model: _, speed: _, trunk } = car;
        bag::destroy_empty(trunk);
        object::delete(id);
    }

    public entry fun add_paint(car: &mut Car, color: String) {
        assert!(!df::exists_(&car.id, b"paint_color"), EPaintAlreadyExists);
        df::add(&mut car.id, b"paint_color", color);
    }
}`,
    validate: (code: string) => {
      const lines = code.split('\n');
      const newErrors: Array<{ line: number, message: string }> = [];

      // Check for build_car function
      const buildCarLineIndex = lines.findIndex(l => l.includes('fun build_car'));
      if (buildCarLineIndex === -1) {
        newErrors.push({ line: 50, message: 'Missing "build_car" function' });
      } else {
        const lineContent = lines[buildCarLineIndex];
        if (lineContent.includes('public entry fun')) {
          newErrors.push({ line: buildCarLineIndex + 1, message: 'Function should be "public fun", not "entry". Entry functions cannot return objects for PTBs.' });
        }
        if (!lineContent.includes('): Car')) {
          newErrors.push({ line: buildCarLineIndex + 1, message: 'Function signature must return a Car object: "...): Car"' });
        }
      }

      return {
        isValid: newErrors.length === 0,
        errors: newErrors
      };
    }
  }
];

function LessonView({ onClose }: LessonViewProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [code, setCode] = useState(chapters[0].initialCode);

  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<{ line: number, message: string }>>([]);
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const handleCompleteCourse = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      setShowCompletionPopup(true);
    }, 4500); // 4.5 seconds of celebration
  };

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      renderLineHighlight: 'all',
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        preview: true,
        showKeywords: true,
        showSnippets: true,
      },
    });

    // Register custom language if needed
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'move')) {
      monaco.languages.register({ id: 'move' });
      monaco.languages.setMonarchTokensProvider('move', {
        keywords: [
          'module', 'use', 'struct', 'fun', 'public', 'entry', 'has', 'key',
          'store', 'drop', 'copy', 'let', 'mut', 'return', 'if', 'else',
          'while', 'loop', 'break', 'continue', 'abort', 'const', 'as',
          'move', 'borrow', 'native', 'acquires', 'friend', 'script'
        ],
        typeKeywords: [
          'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'bool', 'address',
          'vector', 'String', 'Object', 'ID', 'UID'
        ],
        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>='
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, {
              cases: {
                '@typeKeywords': 'type',
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
              cases: {
                '@operators': 'operator',
                '@default': ''
              }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            [/[;,.]/, 'delimiter'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
          ],
          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
          ],
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
          comment: [
            [/[^\/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
          ],
        },
      });

      // Define theme colors for Move language
      monaco.editor.defineTheme('move-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'e6e6e6' },
          { token: 'keyword', foreground: '00D9FF', fontStyle: 'bold' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'type.identifier', foreground: '00FFFF' },
          { token: 'identifier', foreground: 'e6e6e6' },
          { token: 'string', foreground: '89DDFF' },
          { token: 'number', foreground: 'F78C6C' },
          { token: 'comment', foreground: '5C6773', fontStyle: 'italic' },
          { token: 'operator', foreground: '89DDFF' },
          { token: 'delimiter', foreground: '89DDFF' },
        ],
        colors: {
          'editor.background': '#0a0e14',
          'editor.foreground': '#e6e6e6',
          'editor.lineHighlightBackground': '#151a21',
          'editorLineNumber.foreground': '#3d5a80',
          'editorLineNumber.activeForeground': '#00ffff',
          'editor.selectionBackground': '#1a4f6f',
          'editor.inactiveSelectionBackground': '#1a2f3f',
          'editorIndentGuide.background': '#1a2332',
          'editorIndentGuide.activeBackground': '#00ffff40',
          'editorBracketMatch.background': '#00ffff20',
          'editorBracketMatch.border': '#00ffff',
          'editorWidget.background': '#0a0e14',
          'editorWidget.border': '#00ffff40',
          'editorSuggestWidget.background': '#0a0e14',
          'editorSuggestWidget.foreground': '#e6e6e6',
          'editorSuggestWidget.border': '#00ffff40',
          'editorHoverWidget.background': '#0a0e14',
          'editorHoverWidget.foreground': '#e6e6e6',
          'editorHoverWidget.border': '#00ffff40',
          'editorGutter.background': '#0a0e14',
          'editorOverviewRuler.background': '#0a0e14',
          'editorOverviewRuler.border': '#00ffff20',
          'scrollbar.shadow': '#0a0e14',
          'scrollbarSlider.background': '#1a2332',
          'scrollbarSlider.hoverBackground': '#2a3342',
          'scrollbarSlider.activeBackground': '#3a4352',
          'minimap.background': '#0a0e14',
          'minimapSlider.background': '#1a233220',
          'minimapSlider.hoverBackground': '#1a233240',
          'minimapSlider.activeBackground': '#1a233260',
        },
      });

      // Apply the theme immediately
      monaco.editor.setTheme('move-dark');
    }
  };

  const updateErrorDecorations = () => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // Clear previous decorations and markers
    monaco.editor.setModelMarkers(editor.getModel()!, 'moveErrors', []);

    if (errors.length > 0) {
      const markers = errors.map(error => ({
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: error.line,
        startColumn: 1,
        endLineNumber: error.line,
        endColumn: 1000,
        message: error.message,
      }));
      monaco.editor.setModelMarkers(editor.getModel()!, 'moveErrors', markers);
    }
  };

  const checkAnswer = () => {
    setErrors([]);
    setFeedback('');
    setTerminalOutput('');
    setHasChecked(true);

    const currentChapterData = chapters[currentChapter];
    const validationResult = currentChapterData.validate(code);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setFeedback('Build Failed');
      setIsCorrect(false);
      // Format errors in red
      const errorOutput = validationResult.errors.map(err =>
        `Line ${err.line}: ${err.message}`
      ).join('\n');
      setTerminalOutput(errorOutput);
    } else {
      setFeedback('Build Successful');
      setIsCorrect(true);
      setErrors([]);
      setTerminalOutput(`✓ Build completed successfully!\n\n🎉 Congratulations! Chapter ${currentChapterData.id} completed!\n\nmodule sui_garage::car_factory compiled.`);
    }

    // Update error decorations after state change
    setTimeout(updateErrorDecorations, 0);
  };

  const showAnswer = () => {
    const currentChapterData = chapters[currentChapter];
    setCode(currentChapterData.expectedCode);
    setErrors([]);
    setFeedback('Build Successful');
    setIsCorrect(true);
    setHasChecked(true);
    setTerminalOutput('✓ Answer loaded!\n\nmodule sui_garage::car_factory compiled.');
  };

  const tryAgain = () => {
    const currentChapterData = chapters[currentChapter];
    setCode(currentChapterData.initialCode);
    setErrors([]);
    setFeedback('');
    setIsCorrect(false);
    setTerminalOutput('');
    setHasChecked(false);
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel()!, 'moveErrors', []);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      setCode(chapters[nextChapter].initialCode);
      setErrors([]);
      setFeedback('');
      setIsCorrect(false);
      setTerminalOutput('');
      setHasChecked(false);
      if (editorRef.current && monacoRef.current) {
        monacoRef.current.editor.setModelMarkers(editorRef.current.getModel()!, 'moveErrors', []);
      }
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      const prevChapter = currentChapter - 1;
      setCurrentChapter(prevChapter);
      setCode(chapters[prevChapter].initialCode);
      setErrors([]);
      setFeedback('');
      setIsCorrect(false);
      setTerminalOutput('');
      setHasChecked(false);
      if (editorRef.current && monacoRef.current) {
        monacoRef.current.editor.setModelMarkers(editorRef.current.getModel()!, 'moveErrors', []);
      }
    }
  };

  return (
    <div className="lesson-view-overlay">
      <div className="lesson-view-container">
        {/* Header */}
        <div className="lesson-header">
          <h1>Sui Garage</h1>
          <button className="lesson-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="lesson-content">
          {/* Left Panel - Instructions */}
          <div className="lesson-left-panel">
            <div className="lesson-instructions">
              {chapters[currentChapter].description}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lesson-right-panel">
            <div className="code-editor-header">
              <div className="editor-tab">
                <span className="editor-tab-icon">📄</span>
                <span>car_factory.move</span>
              </div>
            </div>
            <div className="monaco-editor-wrapper">
              <Editor
                height="100%"
                language="move"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="move-dark"
                options={{
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: 'full',
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: 'off',
                  lineNumbers: 'on',
                  renderWhitespace: 'selection',
                  folding: true,
                  foldingHighlight: true,
                  showFoldingControls: 'mouseover',
                  matchBrackets: 'always',
                  renderLineHighlight: 'all',
                }}
              />
            </div>

            {/* Terminal Output */}
            <div className="terminal-output">
              <div className="terminal-header">
                <span className="terminal-title">Terminal</span>
              </div>
              <div className="terminal-content">
                {terminalOutput ? (
                  <pre className={`terminal-text ${!isCorrect && hasChecked ? 'terminal-error' : ''}`}>{terminalOutput}</pre>
                ) : (
                  <span className="terminal-placeholder">Run your code to see output...</span>
                )}
              </div>
            </div>

            <div className="code-editor-footer">
              <div className="footer-left">
                {!isCorrect && (
                  <button className="btn-show-answer" onClick={showAnswer}>
                    <span className="btn-icon">💡</span>
                    Show me the answer
                  </button>
                )}
                {!hasChecked ? (
                  <button className="btn-check-answer" onClick={checkAnswer}>
                    <span className="btn-icon">✓</span>
                    Check Answer
                  </button>
                ) : !isCorrect ? (
                  <button className="btn-try-again" onClick={tryAgain}>
                    <span className="btn-icon">🔄</span>
                    Try Again
                  </button>
                ) : null}
              </div>
              <div className="footer-right">
                {currentChapter > 0 && (
                  <button className="btn-prev-chapter" onClick={handlePreviousChapter}>
                    ← Previous Chapter
                  </button>
                )}
                {currentChapter < chapters.length - 1 ? (
                  <button className="btn-next-chapter" disabled={!isCorrect} onClick={handleNextChapter}>Next Chapter →</button>
                ) : (
                  <button className="btn-next-chapter" disabled={!isCorrect} onClick={handleCompleteCourse}>Complete Course 🎉</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="confetti-container">
            {[...Array(150)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'][Math.floor(Math.random() * 5)]
              }}></div>
            ))}
          </div>
          <div className="golden-car-container">
            <img src="/golden_car.png" alt="Golden Sui Car" className="golden-car-img" />
            <div className="nitro-glow"></div>
            <h1 className="celebration-text">LEGENDARY MECHANIC!</h1>
          </div>
        </div>
      )}

      {showCompletionPopup && (
        <div className="completion-popup-overlay">
          <div className="completion-popup">
            <h2>Course Completed! 🏆</h2>
            <div className="completion-message">
              <p>
                Congratulations, Master! You have successfully navigated the high-speed curves of the Sui Move language. From building your first chassis to mastering complex dynamic fields and programmable transactions, you’ve proven you have what it takes to build the next generation of decentralized applications.
              </p>

              <h3>Technical Skills Unlocked:</h3>
              <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Object-Centric Architecture:</strong> You now understand that everything is an object.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Safety First:</strong> You mastered Move's strict ownership and type safety.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>Massive Scalability:</strong> You can now manage thousands of assets using Tables and Bags.</li>
                <li style={{ marginBottom: '0.5rem' }}><strong>On-chain Logic:</strong> You created self-sovereign garage stats and admin capabilities.</li>
              </ul>
            </div>
            <div className="popup-actions">
              <button className="btn-close-popup" onClick={() => setShowCompletionPopup(false)}>Close</button>
              <button className="btn-profile-popup" onClick={onClose}>
                Go to Profile 👤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonView;
