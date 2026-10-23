'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = { src: string; alt: string }

const greetings = ['Hi there 👋', 'Hello — nice to meet you ✨', 'Let’s get to know each other ☕', 'Let’s connect 🤝']

export default function InteractivePortrait({ src, alt }: Props) {
  const [greetingIndex, setGreetingIndex] = useState<number | null>(null)

  return (
    <div className="portrait-stage">
      <button
        type="button"
        className="portrait-tilt relative block h-72 w-64 cursor-pointer border-0 bg-transparent p-0 sm:h-80 sm:w-72"
        aria-label="Click profile portrait to say hello"
        onClick={() => setGreetingIndex((current) => (current === null ? 0 : (current + 1) % greetings.length))}
      >
        <span className="portrait-surface absolute inset-0 block">
          <svg className="portrait-light-backing" viewBox="0 0 1086 1448" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path d="M543 121 C490 121 444 129 403 140 C378 152 355 166 340 180 C326 192 317 205 312 220 C302 233 295 247 290 260 C280 275 272 288 266 300 C257 314 250 327 250 340 C250 355 260 368 261 380 C258 395 262 408 265 420 C268 435 275 448 281 460 C288 475 295 488 303 500 C300 513 297 526 295 540 C294 556 295 568 296 580 C298 596 301 608 304 620 C307 636 308 648 309 660 C312 675 317 688 321 700 C326 715 333 727 339 740 C343 755 340 768 338 780 C335 795 323 809 302 820 C287 834 270 847 254 860 C225 875 194 888 162 900 C132 914 104 927 79 940 C57 952 39 965 31 980 C21 993 16 1007 16 1020 C15 1035 16 1048 17 1060 C19 1077 31 1090 49 1100 C65 1115 81 1128 98 1140 C108 1154 119 1167 127 1180 C132 1195 130 1208 128 1220 C145 1235 176 1248 206 1260 C210 1275 215 1288 222 1300 C250 1315 285 1329 321 1340 C365 1355 402 1370 438 1380 C490 1392 548 1401 600 1405 C615 1406 630 1406 642 1405 C660 1402 678 1392 693 1380 C710 1365 727 1353 744 1340 C770 1327 795 1312 821 1300 C848 1286 876 1272 902 1260 C918 1248 938 1235 950 1220 C960 1207 965 1194 967 1180 C984 1166 1005 1153 1022 1140 C1031 1126 1037 1113 1039 1100 C1048 1088 1055 1074 1057 1060 C1061 1046 1065 1034 1067 1020 C1068 1006 1069 993 1067 980 C1058 965 1042 952 1023 940 C997 926 966 913 934 900 C906 887 877 873 850 860 C840 846 830 833 821 820 C807 808 795 794 786 780 C777 766 768 753 762 740 C766 725 768 712 770 700 C776 685 782 672 787 660 C790 646 794 633 797 620 C799 606 801 593 802 580 C804 566 805 553 805 540 C807 526 808 513 804 500 C804 486 801 472 794 460 C798 446 800 433 798 420 C801 407 805 394 804 380 C807 367 807 354 804 340 C810 326 810 312 806 300 C804 287 799 279 793 273 C782 257 769 242 756 228 C744 213 738 200 731 189 C715 173 701 161 692 140 C672 136 653 130 636 124 C606 121 574 121 543 121 Z" fill="#000" />
          </svg>
          <Image src="/profile-clean.png" alt={alt} fill priority sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-light-image" />
          <Image src={src} alt="" fill priority sizes="(max-width: 640px) 256px, 288px" className="object-contain portrait-dark-image" aria-hidden="true" />
        </span>
        <span className="portrait-invite" aria-hidden>Say hello <span>↖</span></span>
        {greetingIndex !== null && <span className="portrait-greeting" role="status" aria-live="polite">{greetings[greetingIndex]}</span>}
      </button>
    </div>
  )
}
