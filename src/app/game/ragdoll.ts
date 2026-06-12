import Matter from "matter-js";

const { Bodies, Constraint, Composite, Body } = Matter;

export interface RagdollOptions {
  x: number;
  y: number;
  scale?: number;
}

export function createRagdoll({ x, y, scale = 1 }: RagdollOptions): Matter.Composite {
  // A negative group index means objects in this group won't collide with each other
  const ragdollGroup = Body.nextGroup(true);

  const commonOptions = {
    collisionFilter: { 
      group: ragdollGroup,
      category: 0x0002,
      mask: 0x0001
    },
    frictionAir: 0.01,
  };

  // Dimensions (from design doc, scaled)
  const headR = 20 * scale;
  const torsoW = 34 * scale;
  const torsoH = 62 * scale;
  const pelvisW = 30 * scale;
  const pelvisH = 24 * scale;
  const upperArmW = 14 * scale;
  const upperArmH = 36 * scale;
  const forearmW = 12 * scale;
  const forearmH = 34 * scale;
  const thighW = 16 * scale;
  const thighH = 42 * scale;
  const shinW = 13 * scale;
  const shinH = 42 * scale;

  // Distances between parts to set up initial positions
  const headY = y - torsoH / 2 - headR;
  const pelvisY = y + torsoH / 2 + pelvisH / 2;
  const armY = y - torsoH / 2 + upperArmH / 2 + 5;
  const legY = pelvisY + pelvisH / 2 + thighH / 2;

  // Bodies
  const head = Bodies.circle(x, headY, headR, {
    ...commonOptions,
    density: 0.7 * 0.001, // default density in matter is around 0.001
    restitution: 0.4,
    label: "head",
  });

  const torso = Bodies.rectangle(x, y, torsoW, torsoH, {
    ...commonOptions,
    density: 1.0 * 0.001,
    restitution: 0.2,
    label: "torso",
    chamfer: { radius: 10 * scale }, // Make it pill-like
  });

  const pelvis = Bodies.rectangle(x, pelvisY, pelvisW, pelvisH, {
    ...commonOptions,
    density: 1.0 * 0.001,
    restitution: 0.2,
    label: "pelvis",
    chamfer: { radius: 8 * scale },
  });

  // Left Arm
  const upperArmL = Bodies.rectangle(x - torsoW / 2 - upperArmW / 2, armY, upperArmW, upperArmH, {
    ...commonOptions, density: 0.7 * 0.001, restitution: 0.3, label: "upperArmL", chamfer: { radius: 5 * scale },
  });
  const forearmL = Bodies.rectangle(x - torsoW / 2 - upperArmW / 2, armY + upperArmH / 2 + forearmH / 2, forearmW, forearmH, {
    ...commonOptions, density: 0.6 * 0.001, restitution: 0.3, label: "forearmL", chamfer: { radius: 5 * scale },
  });

  // Right Arm
  const upperArmR = Bodies.rectangle(x + torsoW / 2 + upperArmW / 2, armY, upperArmW, upperArmH, {
    ...commonOptions, density: 0.7 * 0.001, restitution: 0.3, label: "upperArmR", chamfer: { radius: 5 * scale },
  });
  const forearmR = Bodies.rectangle(x + torsoW / 2 + upperArmW / 2, armY + upperArmH / 2 + forearmH / 2, forearmW, forearmH, {
    ...commonOptions, density: 0.6 * 0.001, restitution: 0.3, label: "forearmR", chamfer: { radius: 5 * scale },
  });

  // Left Leg
  const thighL = Bodies.rectangle(x - pelvisW / 2 + thighW / 2, legY, thighW, thighH, {
    ...commonOptions, density: 0.8 * 0.001, restitution: 0.25, label: "thighL", chamfer: { radius: 5 * scale },
  });
  const shinL = Bodies.rectangle(x - pelvisW / 2 + thighW / 2, legY + thighH / 2 + shinH / 2, shinW, shinH, {
    ...commonOptions, density: 0.7 * 0.001, restitution: 0.25, label: "shinL", chamfer: { radius: 5 * scale },
  });

  // Right Leg
  const thighR = Bodies.rectangle(x + pelvisW / 2 - thighW / 2, legY, thighW, thighH, {
    ...commonOptions, density: 0.8 * 0.001, restitution: 0.25, label: "thighR", chamfer: { radius: 5 * scale },
  });
  const shinR = Bodies.rectangle(x + pelvisW / 2 - thighW / 2, legY + thighH / 2 + shinH / 2, shinW, shinH, {
    ...commonOptions, density: 0.7 * 0.001, restitution: 0.25, label: "shinR", chamfer: { radius: 5 * scale },
  });

  // Joints (Constraints)
  const neck = Constraint.create({
    bodyA: head, bodyB: torso,
    pointA: { x: 0, y: headR }, pointB: { x: 0, y: -torsoH / 2 },
    stiffness: 0.6,
    length: 0,
    render: { visible: false }
  });

  const spine = Constraint.create({
    bodyA: torso, bodyB: pelvis,
    pointA: { x: 0, y: torsoH / 2 }, pointB: { x: 0, y: -pelvisH / 2 },
    stiffness: 0.5,
    length: 0,
    render: { visible: false }
  });

  // Shoulders
  const shoulderL = Constraint.create({
    bodyA: torso, bodyB: upperArmL,
    pointA: { x: -torsoW / 2 + 5, y: -torsoH / 2 + 10 }, pointB: { x: 0, y: -upperArmH / 2 + 5 },
    stiffness: 0.25,
    length: 0,
    render: { visible: false }
  });
  const shoulderR = Constraint.create({
    bodyA: torso, bodyB: upperArmR,
    pointA: { x: torsoW / 2 - 5, y: -torsoH / 2 + 10 }, pointB: { x: 0, y: -upperArmH / 2 + 5 },
    stiffness: 0.25,
    length: 0,
    render: { visible: false }
  });

  // Elbows
  const elbowL = Constraint.create({
    bodyA: upperArmL, bodyB: forearmL,
    pointA: { x: 0, y: upperArmH / 2 - 5 }, pointB: { x: 0, y: -forearmH / 2 + 5 },
    stiffness: 0.2,
    length: 0,
    render: { visible: false }
  });
  const elbowR = Constraint.create({
    bodyA: upperArmR, bodyB: forearmR,
    pointA: { x: 0, y: upperArmH / 2 - 5 }, pointB: { x: 0, y: -forearmH / 2 + 5 },
    stiffness: 0.2,
    length: 0,
    render: { visible: false }
  });

  // Hips
  const hipL = Constraint.create({
    bodyA: pelvis, bodyB: thighL,
    pointA: { x: -pelvisW / 2 + thighW / 2, y: pelvisH / 2 - 5 }, pointB: { x: 0, y: -thighH / 2 + 5 },
    stiffness: 0.35,
    length: 0,
    render: { visible: false }
  });
  const hipR = Constraint.create({
    bodyA: pelvis, bodyB: thighR,
    pointA: { x: pelvisW / 2 - thighW / 2, y: pelvisH / 2 - 5 }, pointB: { x: 0, y: -thighH / 2 + 5 },
    stiffness: 0.35,
    length: 0,
    render: { visible: false }
  });

  // Knees
  const kneeL = Constraint.create({
    bodyA: thighL, bodyB: shinL,
    pointA: { x: 0, y: thighH / 2 - 5 }, pointB: { x: 0, y: -shinH / 2 + 5 },
    stiffness: 0.25,
    length: 0,
    render: { visible: false }
  });
  const kneeR = Constraint.create({
    bodyA: thighR, bodyB: shinR,
    pointA: { x: 0, y: thighH / 2 - 5 }, pointB: { x: 0, y: -shinH / 2 + 5 },
    stiffness: 0.25,
    length: 0,
    render: { visible: false }
  });

  const ragdollComposite = Composite.create({
    bodies: [
      head, torso, pelvis,
      upperArmL, forearmL, upperArmR, forearmR,
      thighL, shinL, thighR, shinR
    ],
    constraints: [
      neck, spine,
      shoulderL, shoulderR, elbowL, elbowR,
      hipL, hipR, kneeL, kneeR
    ]
  });

  return ragdollComposite;
}
