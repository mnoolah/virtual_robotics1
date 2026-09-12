export type HeartPart = {
  id: string
  label: string
  shortLabel: string
  description: string
  color: string
  markerPosition: [number, number, number]
  labelPosition: { top: string; left: string }
  lineColor: string
}

export const heartParts: HeartPart[] = [
  {
    id: 'left-ventricle',
    label: 'البطين الأيسر',
    shortLabel: 'الأيسر',
    description:
      'الحجرة السفلية اليسرى وأقوى غرف القلب، جدارها العضلي هو الأسمك على الإطلاق. تستقبل الدم المؤكسج من الأذين الأيسر وتضخه بقوة عبر الأبهر إلى كل أعضاء الجسم.',
    color: '#c0392b',
    markerPosition: [0.08, -0.05, 0.42],
    labelPosition: { top: '72%', left: '64%' },
    lineColor: '#c0392b',
  },
  {
    id: 'right-ventricle',
    label: 'البطين الأيمن',
    shortLabel: 'الأيمن',
    description:
      'الحجرة السفلية اليمنى، تستقبل الدم غير المؤكسج القادم من الأذين الأيمن وتضخه بضغط أقل عبر الشريان الرئوي إلى الرئتين لالتقاط الأكسجين.',
    color: '#d17a5a',
    markerPosition: [-0.26, 0.05, 0.55],
    labelPosition: { top: '64%', left: '20%' },
    lineColor: '#d17a5a',
  },
  {
    id: 'left-atrium',
    label: 'الأذين الأيسر',
    shortLabel: 'أذين أيسر',
    description:
      'حجرة علوية صغيرة تستقبل الدم المؤكسج القادم مباشرة من الرئتين عبر الأوردة الرئوية، ثم تمرره إلى البطين الأيسر عبر الصمام التاجي.',
    color: '#d1495b',
    markerPosition: [0.14, 0.6, -0.05],
    labelPosition: { top: '20%', left: '68%' },
    lineColor: '#d1495b',
  },
  {
    id: 'right-atrium',
    label: 'الأذين الأيمن',
    shortLabel: 'أذين أيمن',
    description:
      'حجرة علوية تستقبل الدم غير المؤكسج القادم من الجسم كله عبر الوريدين الأجوفين، ثم تمرره إلى البطين الأيمن عبر الصمام ثلاثي الشرف.',
    color: '#c98a6b',
    markerPosition: [-0.34, 0.56, 0.45],
    labelPosition: { top: '16%', left: '14%' },
    lineColor: '#c98a6b',
  },
  {
    id: 'aorta',
    label: 'الشريان الأبهر',
    shortLabel: 'الأبهر',
    description:
      'أكبر شريان في جسم الإنسان، يخرج من البطين الأيسر ويتقوّس فوق القلب ليوزّع الدم المؤكسج على جميع الأنسجة والأعضاء عبر شبكة من الشرايين المتفرعة.',
    color: '#e05a4e',
    markerPosition: [0.22, 1.07, -0.02],
    labelPosition: { top: '17%', left: '46%' },
    lineColor: '#e05a4e',
  },
  {
    id: 'pulmonary-artery',
    label: 'الشريان الرئوي',
    shortLabel: 'الرئوي',
    description:
      'الشريان الوحيد في الجسم الذي ينقل دمًا غير مؤكسج؛ يخرج من البطين الأيمن وينقسم إلى فرعين يتجهان نحو الرئتين لتفريغ ثاني أكسيد الكربون وتحميل الأكسجين.',
    color: '#6fa3d8',
    markerPosition: [-0.2, 0.9, 0.3],
    labelPosition: { top: '9%', left: '32%' },
    lineColor: '#6fa3d8',
  },
  {
    id: 'vena-cava',
    label: 'الوريد الأجوف',
    shortLabel: 'الأجوف',
    description:
      'الوريدان الأجوفان العلوي والسفلي يجمعان الدم غير المؤكسج من الرأس والذراعين ومن الجذع والساقين على التوالي، ويصبّانه في الأذين الأيمن.',
    color: '#7488d8',
    markerPosition: [-0.42, 0.97, 0.15],
    labelPosition: { top: '30%', left: '6%' },
    lineColor: '#7488d8',
  },
  {
    id: 'pulmonary-veins',
    label: 'الأوردة الرئوية',
    shortLabel: 'أوردة رئوية',
    description:
      'أربعة أوردة تنقل الدم المؤكسج حديثًا من الرئتين إلى الأذين الأيسر، وهي الأوردة الوحيدة في الجسم التي تحمل دمًا غنيًا بالأكسجين.',
    color: '#e0708a',
    markerPosition: [0.36, 0.72, -0.2],
    labelPosition: { top: '20%', left: '90%' },
    lineColor: '#e0708a',
  },
  {
    id: 'mitral-valve',
    label: 'الصمام التاجي',
    shortLabel: 'التاجي',
    description:
      'صمام ذو وريقتين (يُعرف أيضًا بالصمام الميترالي) يفصل الأذين الأيسر عن البطين الأيسر، ويُغلق بإحكام أثناء انقباض البطين لمنع ارتداد الدم إلى الأذين.',
    color: '#f0b429',
    markerPosition: [0.12, 0.28, 0.14],
    labelPosition: { top: '50%', left: '82%' },
    lineColor: '#f0b429',
  },
  {
    id: 'tricuspid-valve',
    label: 'الصمام ثلاثي الشرف',
    shortLabel: 'ثلاثي الشرف',
    description:
      'صمام ذو ثلاث وريقات يفصل الأذين الأيمن عن البطين الأيمن، ويُغلق أثناء انقباض البطين الأيمن لمنع رجوع الدم إلى الأذين.',
    color: '#d99a2b',
    markerPosition: [-0.32, 0.26, 0.37],
    labelPosition: { top: '48%', left: '9%' },
    lineColor: '#d99a2b',
  },
]
