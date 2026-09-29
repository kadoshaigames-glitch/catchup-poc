import type { Scene } from "@babylonjs/core";
import { ClassroomEnvironment } from "./environment/ClassroomEnvironment";

export { ClassroomEnvironment } from "./environment/ClassroomEnvironment";
export { MODULE_ENVIRONMENTS, normalizeModuleId } from "./environment/environmentConfig";
export type { EnvironmentThemeConfig, ModuleThemeId } from "./environment/environmentConfig";

export function buildClassroom(
  scene: Scene,
  initialModuleId = "module-1",
): ClassroomEnvironment {
  return new ClassroomEnvironment(scene, initialModuleId);
}
