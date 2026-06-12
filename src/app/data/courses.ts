import { CourseData } from "../game/course";

export const courses: CourseData[] = [
  {
    id: "course_1",
    name: "First Steps",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4000 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 600, h: 50 },
      { id: "p2", type: "platform", x: 650, y: 500, w: 200, h: 50 },
      { id: "p3", type: "platform", x: 900, y: 600, w: 200, h: 50 },
      { id: "p4", type: "platform", x: 1150, y: 700, w: 200, h: 50 },
      { id: "p5", type: "platform", x: 1400, y: 800, w: 200, h: 50 },
      { id: "p6", type: "platform", x: 1800, y: 900, w: 800, h: 50 },
      { id: "b1", type: "bonusTarget", x: 2000, y: 800, radius: 20, points: 500 },
      { id: "f1", type: "finishFlag", x: 2500, y: 840, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 500, twoStar: 1500, threeStar: 2500 }
  },
  {
    id: "course_2",
    name: "Broken Knees",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4000 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 400, h: 50 },
      { id: "p2", type: "platform", x: 450, y: 500, w: 100, h: 50 },
      { id: "spike1", type: "spike", x: 600, y: 550, w: 100, h: 50 },
      { id: "p4", type: "platform", x: 750, y: 500, w: 100, h: 50 },
      { id: "spike2", type: "spike", x: 900, y: 650, w: 100, h: 50 },
      { id: "p6", type: "platform", x: 1050, y: 600, w: 100, h: 50 },
      { id: "p7", type: "platform", x: 1250, y: 800, w: 1200, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1800, y: 750, radius: 20, points: 500 },
      { id: "f1", type: "finishFlag", x: 2300, y: 740, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 800, twoStar: 1800, threeStar: 2800 }
  },
  {
    id: "course_3",
    name: "Momentum",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4500 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 400, h: 50 },
      { id: "p2", type: "platform", x: 400, y: 400, w: 800, h: 50, angle: 0.3 }, // Downward ramp
      { id: "p3", type: "platform", x: 1200, y: 636, w: 400, h: 50, angle: -0.2 }, // Small kicker
      // Gap!
      { id: "p4", type: "platform", x: 2200, y: 800, w: 1000, h: 50 },
      { id: "b1", type: "bonusTarget", x: 2500, y: 650, radius: 20, points: 500 },
      { id: "b2", type: "bonusTarget", x: 2800, y: 750, radius: 20, points: 500 },
      { id: "f1", type: "finishFlag", x: 3100, y: 740, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 1500, twoStar: 2500, threeStar: 3500 }
  },
  {
    id: "course_4",
    name: "The Canyon",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4500 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 500, h: 50 },
      { id: "p2", type: "platform", x: 1000, y: 600, w: 200, h: 50, angle: -0.1 },
      { id: "p3", type: "platform", x: 1600, y: 800, w: 200, h: 50, angle: 0.1 },
      { id: "p4", type: "platform", x: 2200, y: 600, w: 200, h: 50 },
      { id: "p5", type: "platform", x: 2800, y: 900, w: 800, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1300, y: 500, radius: 25, points: 1000 },
      { id: "b2", type: "bonusTarget", x: 1900, y: 600, radius: 25, points: 1000 },
      { id: "f1", type: "finishFlag", x: 3500, y: 840, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 1500, twoStar: 2800, threeStar: 4000 }
  },
  {
    id: "course_5",
    name: "Bumper Garden",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4500 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 500, h: 50 },
      { id: "bump1", type: "bumper", x: 800, y: 500, radius: 40, restitution: 1.5 },
      { id: "bump2", type: "bumper", x: 1200, y: 600, radius: 50, restitution: 1.8 },
      { id: "bump3", type: "bumper", x: 1000, y: 800, radius: 40, restitution: 1.5 },
      { id: "bump4", type: "bumper", x: 1600, y: 400, radius: 60, restitution: 2.0 },
      { id: "p2", type: "platform", x: 2000, y: 900, w: 1000, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1400, y: 500, radius: 20, points: 500 },
      { id: "f1", type: "finishFlag", x: 2800, y: 840, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 1500, twoStar: 3000, threeStar: 4500 }
  },
  {
    id: "course_6",
    name: "Spin Cycle",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 4500 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 500, h: 50 },
      { id: "spin1", type: "spinner", x: 1000, y: 600, w: 300, h: 20, angularSpeed: 0.05 },
      { id: "spin2", type: "spinner", x: 1500, y: 700, w: 400, h: 30, angularSpeed: -0.04 },
      { id: "spin3", type: "spinner", x: 2000, y: 500, w: 200, h: 20, angularSpeed: 0.08 },
      { id: "p2", type: "platform", x: 2500, y: 900, w: 800, h: 50 },
      { id: "f1", type: "finishFlag", x: 3200, y: 840, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 2000, twoStar: 3500, threeStar: 5000 }
  },
  {
    id: "course_7",
    name: "Crash Factory",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 5000 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 500, h: 50 },
      { id: "p2", type: "platform", x: 500, y: 400, w: 500, h: 50, angle: 0.2 }, // Ramp
      { id: "bump1", type: "bumper", x: 1200, y: 700, radius: 40, restitution: 1.8 },
      { id: "spin1", type: "spinner", x: 1800, y: 800, w: 300, h: 20, angularSpeed: 0.06 },
      { id: "p3", type: "platform", x: 2200, y: 1000, w: 400, h: 50, angle: -0.1 },
      { id: "bump2", type: "bumper", x: 2800, y: 900, radius: 50, restitution: 1.5 },
      { id: "p4", type: "platform", x: 3200, y: 1100, w: 800, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1500, y: 600, radius: 20, points: 500 },
      { id: "f1", type: "finishFlag", x: 3800, y: 1040, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 2500, twoStar: 4000, threeStar: 6000 }
  },
  {
    id: "course_8",
    name: "The Gauntlet",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 5000 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 400, h: 50 },
      { id: "m1", type: "movingPlatform", x: 500, y: 500, w: 200, h: 30, endX: 900, endY: 500, moveSpeed: 2 },
      { id: "m2", type: "movingPlatform", x: 1200, y: 600, w: 150, h: 30, endX: 1200, endY: 900, moveSpeed: 3 },
      { id: "spin1", type: "spinner", x: 1800, y: 700, w: 400, h: 20, angularSpeed: 0.05 },
      { id: "p2", type: "platform", x: 2400, y: 900, w: 200, h: 50 },
      { id: "p3", type: "platform", x: 2800, y: 1000, w: 800, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1000, y: 400, radius: 20, points: 1000 },
      { id: "b2", type: "bonusTarget", x: 2100, y: 800, radius: 20, points: 1000 },
      { id: "f1", type: "finishFlag", x: 3400, y: 940, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 3000, twoStar: 5000, threeStar: 7000 }
  },
  {
    id: "course_9",
    name: "Pinball Machine",
    launchPoint: { x: 400, y: 100 },
    cameraBounds: { minX: 0, maxX: 3000 },
    objects: [
      { id: "p1", type: "platform", x: 200, y: 200, w: 400, h: 50 },
      // Funnel
      { id: "p2", type: "platform", x: 0, y: 500, w: 600, h: 50, angle: 0.5 },
      { id: "p3", type: "platform", x: 1000, y: 500, w: 600, h: 50, angle: -0.5 },
      // Bumpers
      { id: "bump1", type: "bumper", x: 500, y: 700, radius: 40, restitution: 2.0 },
      { id: "bump2", type: "bumper", x: 800, y: 800, radius: 40, restitution: 2.0 },
      { id: "bump3", type: "bumper", x: 650, y: 950, radius: 40, restitution: 2.0 },
      { id: "spin1", type: "spinner", x: 650, y: 1200, w: 400, h: 20, angularSpeed: 0.1 },
      { id: "p4", type: "platform", x: 200, y: 1500, w: 1000, h: 50 },
      { id: "b1", type: "bonusTarget", x: 650, y: 850, radius: 30, points: 1000 },
      { id: "f1", type: "finishFlag", x: 1000, y: 1440, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 2000, twoStar: 4000, threeStar: 8000 }
  },
  {
    id: "course_10",
    name: "Tumbledown",
    launchPoint: { x: 200, y: 300 },
    cameraBounds: { minX: 0, maxX: 6000 },
    objects: [
      { id: "p1", type: "platform", x: 0, y: 400, w: 400, h: 50 },
      { id: "p2", type: "platform", x: 400, y: 500, w: 100, h: 50 }, // step
      { id: "p3", type: "platform", x: 500, y: 600, w: 100, h: 50 }, // step
      { id: "p4", type: "platform", x: 600, y: 600, w: 400, h: 50, angle: 0.2 }, // ramp
      // canyon jump
      { id: "spin1", type: "spinner", x: 1500, y: 800, w: 300, h: 20, angularSpeed: 0.06 },
      { id: "spin2", type: "spinner", x: 2000, y: 900, w: 300, h: 20, angularSpeed: -0.06 },
      // bumper field
      { id: "bump1", type: "bumper", x: 2600, y: 1000, radius: 50, restitution: 1.8 },
      { id: "bump2", type: "bumper", x: 2900, y: 900, radius: 50, restitution: 1.8 },
      { id: "bump3", type: "bumper", x: 3200, y: 1100, radius: 50, restitution: 1.8 },
      // moving platform finale
      { id: "m1", type: "movingPlatform", x: 3800, y: 1200, w: 200, h: 50, endX: 4300, endY: 1200, moveSpeed: 4 },
      { id: "p5", type: "platform", x: 4800, y: 1300, w: 800, h: 50 },
      { id: "b1", type: "bonusTarget", x: 1500, y: 650, radius: 25, points: 1000 },
      { id: "b2", type: "bonusTarget", x: 2900, y: 750, radius: 25, points: 1000 },
      { id: "b3", type: "bonusTarget", x: 4050, y: 1100, radius: 25, points: 2000 },
      { id: "f1", type: "finishFlag", x: 5400, y: 1240, w: 60, h: 120 },
    ],
    starThresholds: { oneStar: 5000, twoStar: 8000, threeStar: 12000 }
  }
];
