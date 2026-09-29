import {
  Color3,
  MeshBuilder,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import type { Scene } from "@babylonjs/core";
import type { CreateInstructor, InstructorHandle } from "./types";

function mat(scene: Scene, name: string, color: Color3): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = color;
  material.specularColor = new Color3(0.08, 0.08, 0.08);
  return material;
}

/**
 * Temporary humanoid. Not the company mascot.
 * Replace by changing ClassroomScene's createInstructor factory only.
 */
export const createPlaceholderInstructor: CreateInstructor = (scene) => {
  const root = new TransformNode("instructorRoot", scene);
  root.position = new Vector3(1.55, 0, 0.35);

  const suit = mat(scene, "instructorSuit", new Color3(0.16, 0.18, 0.22));
  const shirt = mat(scene, "instructorShirt", new Color3(0.82, 0.84, 0.86));
  const skin = mat(scene, "instructorSkin", new Color3(0.76, 0.62, 0.52));

  const torso = MeshBuilder.CreateBox(
    "instructorTorso",
    { width: 0.42, height: 0.62, depth: 0.22 },
    scene,
  );
  torso.position.y = 1.18;
  torso.material = suit;
  torso.parent = root;

  const pelvis = MeshBuilder.CreateBox(
    "instructorPelvis",
    { width: 0.38, height: 0.18, depth: 0.2 },
    scene,
  );
  pelvis.position.y = 0.8;
  pelvis.material = suit;
  pelvis.parent = root;

  const neck = MeshBuilder.CreateCylinder(
    "instructorNeck",
    { height: 0.1, diameter: 0.1 },
    scene,
  );
  neck.position.y = 1.54;
  neck.material = skin;
  neck.parent = root;

  const head = MeshBuilder.CreateSphere("instructorHead", { diameter: 0.28 }, scene);
  head.position.y = 1.72;
  head.material = skin;
  head.parent = root;

  const collar = MeshBuilder.CreateBox(
    "instructorCollar",
    { width: 0.2, height: 0.12, depth: 0.04 },
    scene,
  );
  collar.position = new Vector3(0, 1.42, 0.12);
  collar.material = shirt;
  collar.parent = root;

  for (const side of [-1, 1]) {
    const arm = MeshBuilder.CreateCylinder(
      `instructorArm${side}`,
      { height: 0.55, diameter: 0.09 },
      scene,
    );
    arm.position = new Vector3(side * 0.28, 1.12, 0);
    arm.material = suit;
    arm.parent = root;

    const hand = MeshBuilder.CreateSphere(
      `instructorHand${side}`,
      { diameter: 0.09 },
      scene,
    );
    hand.position = new Vector3(side * 0.28, 0.82, 0.02);
    hand.material = skin;
    hand.parent = root;

    const leg = MeshBuilder.CreateCylinder(
      `instructorLeg${side}`,
      { height: 0.72, diameter: 0.12 },
      scene,
    );
    leg.position = new Vector3(side * 0.1, 0.36, 0);
    leg.material = suit;
    leg.parent = root;
  }

  const handle: InstructorHandle = {
    root,
    update: (elapsedSec) => {
      root.position.y = Math.sin(elapsedSec * 1.4) * 0.012;
    },
    dispose: () => {
      root.dispose();
    },
  };

  return handle;
};
