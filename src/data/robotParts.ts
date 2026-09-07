export type RobotPart = {
  id: string
  label: string
  shortLabel: string
  description: string
  color: string
  markerPosition: [number, number, number]
  labelPosition: { top: string; left: string }
  lineColor: string
}

export const robotParts: RobotPart[] = [
  {
    id: 'processor',
    label: 'وحدة التحكم',
    shortLabel: 'المعالج',
    description:
      'العقل الرقمي للروبوت. تستقبل بيانات المستشعرات، تشغّل خوارزميات اتخاذ القرار، وترسل أوامر الحركة إلى المفاصل والمحركات في أجزاء من الثانية.',
    color: '#8b2f5e',
    markerPosition: [0, 1.62, 0.42],
    labelPosition: { top: '8%', left: '50%' },
    lineColor: 'var(--line-purple)',
  },
  {
    id: 'sensor-eye',
    label: 'المستشعرات البصرية',
    shortLabel: 'العين',
    description:
      'كاميرا وحساسات مسح ضوئي (LiDAR) تمنح الروبوت رؤية للمحيط، وتكتشف العوائق والأجسام لتوجيه القرار الحركي بدقة.',
    color: '#3a8fb7',
    markerPosition: [0.32, 1.5, 0.78],
    labelPosition: { top: '18%', left: '85%' },
    lineColor: 'var(--line-teal)',
  },
  {
    id: 'arm',
    label: 'الذراع الآلي',
    shortLabel: 'الذراع',
    description:
      'مكوّن من عدة مفاصل ومشابك (Gripper)، يتيح للروبوت الإمساك بالأشياء ونقلها وتنفيذ مهام دقيقة تحتاج تحكمًا في الاتجاهات الست.',
    color: '#d1495b',
    markerPosition: [1.05, 0.78, 0.25],
    labelPosition: { top: '30%', left: '88%' },
    lineColor: 'var(--line-red)',
  },
  {
    id: 'servo',
    label: 'المفاصل المحرّكة',
    shortLabel: 'السيرفو',
    description:
      'محركات سيرفو دقيقة توفر الدوران والانثناء عند كل مفصل، وتترجم أوامر المعالج إلى حركة فعلية سلسة ومتحكم بزاويتها.',
    color: '#c98a2c',
    markerPosition: [-1.0, 0.85, 0.2],
    labelPosition: { top: '55%', left: '9%' },
    lineColor: '#c98a2c',
  },
  {
    id: 'battery',
    label: 'وحدة الطاقة',
    shortLabel: 'البطارية',
    description:
      'حزمة بطاريات تخزّن الطاقة وتغذي جميع الدارات والمحركات، وتحدد مدة عمل الروبوت المستقلة بين كل شحنتين.',
    color: '#4a7c59',
    markerPosition: [0, 0.55, -0.55],
    labelPosition: { top: '78%', left: '18%' },
    lineColor: '#4a7c59',
  },
  {
    id: 'base',
    label: 'القاعدة المتحركة',
    shortLabel: 'العجلات',
    description:
      'عجلات أو مجنزرات تحمل وزن الروبوت وتنفّذ أوامر التنقل، وتحتوي غالبًا على حساسات توازن تمنع الانقلاب أثناء الحركة.',
    color: '#5a5a72',
    markerPosition: [0, -0.35, 0],
    labelPosition: { top: '86%', left: '68%' },
    lineColor: '#5a5a72',
  },
]
