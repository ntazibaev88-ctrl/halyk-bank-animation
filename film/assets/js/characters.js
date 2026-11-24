// Character silhouettes for «АТАНЫҢ АМАНАТЫ».
// Shapes are authored as landmark points and joined with Catmull-Rom splines,
// so the same grandfather (Ата) and grandson (Бала) appear in every scene.
(function (global) {
  function spline(pts, closed = true, tension = 0.5) {
    // pts: [[x,y], ...]; a point written as [x,y,'c'] is a hard corner.
    const n = pts.length, P = i => pts[(i + n) % n];
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const k = tension / 3 * 2;
      let c1 = [p1[0] + (p2[0] - (closed || i > 0 ? p0[0] : p1[0])) * k / 2, p1[1] + (p2[1] - (closed || i > 0 ? p0[1] : p1[1])) * k / 2];
      let c2 = [p2[0] - ((closed || i < n - 2 ? p3[0] : p2[0]) - p1[0]) * k / 2, p2[1] - ((closed || i < n - 2 ? p3[1] : p2[1]) - p1[1]) * k / 2];
      if (p1[2] === 'c') c1 = [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3];
      if (p2[2] === 'c') c2 = [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3];
      d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d + (closed ? ' Z' : '');
  }

  // ---------- ATA (grandfather), facing right, crown of skullcap at (0,0) ----------
  const ataHead = [
    // taqiya skullcap
    [-92, 66, 'c'], [-90, 34], [-68, 8], [-26, -5], [22, -6], [58, 10], [78, 40, 'c'], [83, 54, 'c'],
    // forehead, brow, deep-set eye, strong nose
    [75, 58, 'c'], [79, 86], [86, 110], [79, 124, 'c'], [86, 136], [98, 154], [110, 172], [109, 180],
    [97, 183], [90, 186, 'c'],
    // drooping moustache
    [99, 196], [101, 205], [93, 208, 'c'],
    // long beard, tapering to a point
    [99, 232], [99, 266], [90, 300], [76, 334], [62, 360], [52, 378, 'c'],
    // back edge of beard up to the jaw
    [44, 352], [32, 320], [18, 296], [6, 284],
    // throat / neck front
    [4, 300], [10, 322, 'c'],
    // neck back up to the occiput
    [-58, 250], [-76, 214], [-96, 172], [-106, 126], [-100, 84, 'c']
  ];
  // Shapan robe, stooped back, seated, knees forward. Joins under the beard.
  const ataBody = [
    [10, 318, 'c'], [36, 336], [66, 372], [92, 430], [112, 500], [150, 560], [230, 600], [290, 640], [312, 700],
    [318, 1500, 'c'], [-310, 1500, 'c'], [-292, 700], [-268, 560], [-236, 430], [-196, 340], [-140, 282], [-84, 254], [-56, 248, 'c']
  ];
  const ataArmDown = [ // forearm resting, hand on cane head
    [-30, 360, 'c'], [20, 430], [80, 480], [140, 500], [190, 494], [214, 506], [216, 528], [198, 540], [150, 544], [80, 530], [10, 500], [-50, 440, 'c']
  ];
  const ataCane = [[198, 520, 'c'], [212, 520, 'c'], [262, 1050, 'c'], [246, 1050, 'c']];

  // ---------- BALA (grandson), facing left, crown at (0,0) ----------
  const balaHead = [
    // short hair with a fringe
    [62, 38], [44, 10], [12, -4], [-22, -2], [-50, 12], [-64, 34], [-60, 44, 'c'], [-66, 52, 'c'],
    // forehead, brow, eye, small nose, lips, rounded chin
    [-70, 72], [-73, 88], [-68, 98, 'c'], [-73, 108], [-82, 120], [-80, 126], [-72, 129, 'c'],
    [-73, 136], [-69, 140, 'c'], [-71, 146], [-66, 156], [-54, 166], [-38, 170], [-26, 172, 'c'],
    // neck
    [-22, 196, 'c'], [34, 196, 'c'], [40, 168], [58, 148], [72, 118], [76, 82]
  ];
  const balaBody = [
    [-24, 188, 'c'], [-58, 200], [-92, 220], [-120, 262], [-138, 330], [-150, 420], [-190, 470], [-236, 520], [-250, 600],
    [-256, 1500, 'c'], [200, 1500, 'c'], [194, 640], [176, 470], [150, 330], [120, 250], [80, 210], [36, 192, 'c']
  ];
  // Back view of the boy standing (scene 8)
  const balaBack = [
    // head (back view), slight ears
    [0, -2], [28, 2], [46, 22], [50, 50], [56, 58], [54, 72], [46, 78], [40, 100], [26, 116],
    // neck, shoulders, right arm hanging
    [24, 130, 'c'], [62, 140], [92, 154], [104, 186], [108, 250], [112, 320], [116, 372], [108, 392], [98, 380],
    [92, 320], [86, 262], [80, 236, 'c'],
    // torso, right leg
    [78, 330], [74, 392, 'c'], [70, 500], [66, 600], [70, 628], [44, 632, 'c'], [40, 610], [36, 500], [8, 404, 'c'],
    // left leg
    [-8, 404, 'c'], [-36, 500], [-40, 610], [-44, 632, 'c'], [-70, 628], [-66, 600], [-70, 500], [-74, 392, 'c'],
    // left arm
    [-78, 330], [-80, 236, 'c'], [-86, 262], [-92, 320], [-98, 380], [-108, 392], [-116, 372], [-112, 320], [-108, 250], [-104, 186],
    [-92, 154], [-62, 140], [-24, 130, 'c'],
    [-26, 116], [-40, 100], [-46, 78], [-54, 72], [-56, 58], [-50, 50], [-46, 22], [-28, 2]
  ];

  global.CHARS = {
    spline,
    ata: { head: spline(ataHead), body: spline(ataBody), arm: spline(ataArmDown), cane: spline(ataCane) },
    bala: { head: spline(balaHead), body: spline(balaBody), back: spline(balaBack) }
  };
})(window);
