import { mergeWith } from "lodash";
import { customizer } from "../utils";

export function createUserExcludeFields(options) {
  const exclude = ["user_id"];
  return mergeWith(options, {
    graphql: {
      create: { exclude },
      update: { exclude }
    }
  }, customizer);
}