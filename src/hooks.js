import { merge, isArray, isString } from "lodash";

function mapModelHooks(hooks) {
  return hooks.reduce(function (data, current) {
    if (!data[current.type]) {
      data[current.type] = {};
    }

    if (!data[current.type].before) {
      data[current.type].before = [];
    }

    if (current.before) {
      data[current.type].before.push(current.before);
    }

    if (!data[current.type].after) {
      data[current.type].after = [];
    }

    if (current.after) {
      data[current.type].after.push(current.after);
    }

    return data;
  }, {});
}

export function createModelHook(hook) {
  hook = mapModelHooks(hook);
  return ["find", "create", "update", "delete"].reduce(function (data, current) {
    data[current] = {};
    if (hook[current] && hook[current].before) {
      data[current].before = function (args, context, info, source) {
        hook[current].before.forEach(function (fn) {
          fn(args, context, info, source);
        });
      }
    }

    if (hook[current] && hook[current].after) {
      data[current].after = function (args, context, info, source) {
        hook[current].after.forEach(function (fn) {
          fn(args, context, info, source);
        });
      }
    }

    return data;
  }, {});
}