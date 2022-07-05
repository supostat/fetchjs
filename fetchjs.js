const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

let originalTarget;
let propertiesChain = "";

export function fetch(target) {
  if (!originalTarget) {
    originalTarget = target;
  }
  if (target === undefined) {
    showError("Object argument passed into fetchjs is undefined");
  }

  function showError(message) {
    console.error("Error fetching from this object:", originalTarget);
    throw new Error(message);
  }

  return new Proxy(target, {
    get(target, prop) {
      if (propertiesChain === "") {
        propertiesChain += prop;
      } else {
        propertiesChain += `.${prop}`;
      }
      if (prop in target) {
        if (isObject(target[prop])) {
          return fetch(target[prop]);
        }
        propertiesChain = "";
        return target[prop];
      } else {
        showError(`Property '${propertiesChain}' is undefined`);
      }
    }
  });
};
