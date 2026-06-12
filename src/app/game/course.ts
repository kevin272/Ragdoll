import Matter from "matter-js";

export type CourseObjectType = "platform" | "bumper" | "bonusTarget" | "spinner" | "movingPlatform" | "finishFlag" | "spike";

export interface CourseObject {
  id: string; // for tracking
  type: CourseObjectType;
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
  angle?: number;
  restitution?: number;
  points?: number;
  // For spinner
  angularSpeed?: number;
  // For moving platform
  endX?: number;
  endY?: number;
  moveSpeed?: number;
}

export interface CourseData {
  id: string;
  name: string;
  launchPoint: { x: number; y: number };
  cameraBounds: { minX: number; maxX: number };
  objects: CourseObject[];
  starThresholds: { oneStar: number; twoStar: number; threeStar: number };
}

export function buildCourse(course: CourseData): Matter.Composite {
  const composite = Matter.Composite.create();

  const bodies: Matter.Body[] = [];
  const constraints: Matter.Constraint[] = [];

  for (const obj of course.objects) {
    let body: Matter.Body | null = null;

    switch (obj.type) {
      case "platform":
        body = Matter.Bodies.rectangle((obj.x) + (obj.w || 0) / 2, (obj.y) + (obj.h || 0) / 2, obj.w || 100, obj.h || 20, {
          isStatic: true,
          angle: obj.angle || 0,
          friction: 0.7,
          restitution: 0.1,
          label: `platform_${obj.id}`,
          render: { fillStyle: "#2E2C2A" }
        });
        break;
      case "bumper":
        body = Matter.Bodies.circle(obj.x, obj.y, obj.radius || 30, {
          isStatic: true,
          restitution: obj.restitution || 1.5,
          label: `bumper_${obj.id}`,
        });
        break;
      case "bonusTarget":
        body = Matter.Bodies.circle(obj.x, obj.y, obj.radius || 20, {
          isStatic: true,
          isSensor: true,
          label: `bonusTarget_${obj.id}_${obj.points || 500}`,
        });
        break;
      case "spinner":
        body = Matter.Bodies.rectangle(obj.x, obj.y, obj.w || 200, obj.h || 20, {
          label: `spinner_${obj.id}_${obj.angularSpeed || 0.05}`,
          friction: 0.2,
          restitution: 0.5,
          render: { fillStyle: "#2E2C2A" },
          collisionFilter: { group: Matter.Body.nextGroup(true) } // Doesn't matter, just a regular body but attached
        });
        
        // constraint to hold it in place
        const pivot = Matter.Constraint.create({
          pointA: { x: obj.x, y: obj.y },
          bodyB: body,
          pointB: { x: 0, y: 0 },
          stiffness: 1,
          length: 0,
          render: { visible: false }
        });
        constraints.push(pivot);
        break;
      case "movingPlatform":
        // Starting position
        body = Matter.Bodies.rectangle((obj.x) + (obj.w || 0) / 2, (obj.y) + (obj.h || 0) / 2, obj.w || 100, obj.h || 20, {
          isStatic: true, // We will manually set position, so it can be static, but usually kinematic is better. Matter doesn't officially have 'kinematic'. isStatic=true works if we translate it.
          friction: 0.8,
          restitution: 0.1,
          label: `movingPlatform_${obj.id}_${obj.x}_${obj.y}_${obj.endX}_${obj.endY}_${obj.moveSpeed || 2}`,
          render: { fillStyle: "#2E2C2A" }
        });
        break;
      case "finishFlag":
        body = Matter.Bodies.rectangle(obj.x, obj.y, obj.w || 60, obj.h || 120, {
          isStatic: true,
          isSensor: true,
          label: `finishFlag_${obj.id}`,
        });
        break;
      case "spike":
        body = Matter.Bodies.rectangle((obj.x) + (obj.w || 0) / 2, (obj.y) + (obj.h || 0) / 2, obj.w || 40, obj.h || 40, {
          isStatic: true,
          label: `spikeObstacle_${obj.id}`
        });
        break;
    }

    if (body) bodies.push(body);
  }

  Matter.Composite.add(composite, [...bodies, ...constraints]);
  return composite;
}
