// src/i18n.ts — Bilingual translations: English + Khmer

export type Lang = 'en' | 'km';

const translations = {
    en: {
        // ── Navbar ──────────────────────────────────────────────
        score: 'Score',
        level: 'Level',
        bufferIntegrity: 'Buffer Integrity',
        soundOn: 'Sound On (M)',
        soundOff: 'Sound Off (M)',
        backToMenu: 'Back to Menu',
        openReference: 'Open Reference',
        langLabel: 'KH',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'SLOW',
        shield: 'SHIELD',
        doubleScore: '2X SCORE',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'SYSTEM INITIALIZATION',
        subtitle: "Type fast. Don't let anything breach the buffer.",
        cpuOverload: 'CPU Overload',
        dataStream: 'Data Stream',
        highScore: 'High Score',
        cpuDesc: 'Math & logic equations fall from above. Type the answer to destroy them — before they hit the bottom.',
        streamDesc: 'Number packets rain down. Type the 1–3 digit number exactly as it appears — pure speed and accuracy.',
        easy: 'EASY',
        medium: 'MEDIUM',
        hard: 'HARD',
        initCpu: 'INITIALIZE CPU',
        initStream: 'INITIALIZE STREAM',
        trainingProtocol: 'TRAINING PROTOCOL',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'Type answer...',
        sysOffline: 'System Offline',
        escMenu: 'Menu',
        restart: 'Restart',
        mute: 'Mute',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'Reference',
        powerUps: 'Power-ups',
        slowPowerName: '⏱ SLOW',
        shieldPowerName: '🛡 SHIELD',
        doublePowerName: '⚡ 2X',
        slowPowerDesc: 'Halves fall speed for 10 seconds. Gives you breathing room.',
        shieldPowerDesc: 'Blocks all buffer damage for 10 seconds. Miss without penalty.',
        doublePowerDesc: 'Doubles score from every correct answer for 10 seconds.',
        powerGlowHint: 'Power-up equations glow — prioritize them for maximum impact.',
        binaryTitle: 'Binary (Base 2)',
        binaryPrefix: 'Prefix: ',
        binaryDesc: '. Uses only 0 and 1.',
        hexTitle: 'Hexadecimal (Base 16)',
        hexPrefix: 'Prefix: ',
        hexDesc: '. Uses 0-9 and A-F.',
        moduloTitle: 'Modulo (%)',
        moduloDesc: 'The remainder after division.',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'SYSTEM CRASHED',
        bufferOverflow: 'Buffer overflow detected.',
        finalScore: 'Final Score',
        levelReached: 'Level Reached',
        newHighScore: 'NEW HIGH SCORE!',
        tip: 'Tip',
        tipPowerup: 'Watch for glowing power-up equations — SLOW ⏱, SHIELD 🛡, and 2X ⚡ can turn the tide.',
        tipHealth: 'Each correct answer restores Buffer Integrity. Level up every 500 XP for a health boost.',
        reboot: 'REBOOT SYSTEM',
        returnMenu: 'RETURN TO MENU',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'TRAINING PROTOCOL',
        exitTraining: 'EXIT TRAINING',
        continue: 'CONTINUE',
        incorrectKey: 'INCORRECT KEY',
        useFinger: 'Use',
        toPress: 'to press',

        // Tutorial step titles
        t1Title: 'System Interface',
        t2Title: 'Home Row Stance',
        t3Title: 'Number Reach',
        t4Title: 'Drill: Left Hand',
        t5Title: 'Drill: Right Hand',
        t6Title: 'Drill: Mixed',
        t7Title: 'Training Complete',

        // Tutorial step content
        t1Content: 'Welcome, Operator. Equations and number sequences will fall from above — type the correct answer and press nothing else to neutralize them before they breach the buffer.',
        t2Content: 'Place your fingers on the Home Row (A-S-D-F and J-K-L-;). This is your base of operations. Always return here between keystrokes.',
        t3Content: 'Reach up from the Home Row to strike the number keys (1-0). Keep your eyes on the screen, not your fingers.',
        t4Content: 'Type each number using the correct LEFT hand finger shown below. The highlighted key is your target.',
        t5Content: 'Now switch to your RIGHT hand. Type each number as it lights up — return to home row after each strike.',
        t6Content: 'Final drill — both hands required. This is the closest simulation to real gameplay. Stay calm and type steadily.',
        t7Content: 'Systems online. A few tips before you engage:\n• Correct answers restore Buffer Integrity\n• Power-ups (SLOW ⏱, SHIELD 🛡, 2X ⚡) appear on special equations — prioritize them\n• Level up every 500 points to earn a health boost\n• Press R to restart, ESC for menu, M to mute',

        // Finger names
        lPinky: 'Left Pinky',
        lRing: 'Left Ring',
        lMiddle: 'Left Middle',
        lIndex: 'Left Index',
        rIndex: 'Right Index',
        rMiddle: 'Right Middle',
        rRing: 'Right Ring',
        rPinky: 'Right Pinky',
    },

    km: {
        // ── Navbar ──────────────────────────────────────────────
        score: 'ពិន្ទុ',
        level: 'កម្រិត',
        bufferIntegrity: 'ភាពត្រឹមត្រូវខ្ទប់',
        soundOn: 'បើកសំឡេង (M)',
        soundOff: 'បិទសំឡេង (M)',
        backToMenu: 'ត្រឡប់ទៅម៉ឺនុយ',
        openReference: 'បើកឯកសារយោង',
        langLabel: 'EN',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'យឺត',
        shield: 'ខែល',
        doubleScore: 'x2 ពិន្ទុ',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'ការចាប់ផ្ដើមប្រព័ន្ធ',
        subtitle: 'វាយឱ្យបានលឿន! កុំឱ្យអ្វីបំពានខ្ទប់!',
        cpuOverload: 'ការផ្ទុកលើស CPU',
        dataStream: 'ស្ទ្រីមទិន្នន័យ',
        highScore: 'ពិន្ទុខ្ពស់បំផុត',
        cpuDesc: 'សមីការគណិតវិទ្យានិងតក្កវិជ្ជាធ្លាក់ចុះ។ វាយចម្លើយដើម្បីបំបែករបស់ពួកវា — មុននឹងវាដល់បាត!',
        streamDesc: 'ខ្សែស្រឡាយលេខជួរតូចៗធ្លាក់ចុះ។ វាយលេខ ១-៣ ខ្ទង់ឱ្យត្រឹមត្រូវ — ល្បឿននិងភាពត្រឹមត្រូវ!',
        easy: 'ងាយ',
        medium: 'មធ្យម',
        hard: 'ពិបាក',
        initCpu: 'ចាប់ផ្ដើម CPU',
        initStream: 'ចាប់ផ្ដើមស្ទ្រីម',
        trainingProtocol: 'វិធីសាស្ត្រហ្វឹកហ្វឺន',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'វាយចម្លើយ...',
        sysOffline: 'ប្រព័ន្ធបិទ',
        escMenu: 'ម៉ឺនុយ',
        restart: 'ចាប់ផ្ដើមម្ដងទៀត',
        mute: 'បិទសំឡេង',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'ឯកសារយោង',
        powerUps: 'អានុភាព',
        slowPowerName: '⏱ យឺត',
        shieldPowerName: '🛡 ខែល',
        doublePowerName: '⚡ x2',
        slowPowerDesc: 'កាត់កន្លះល្បឿនដួលចុះ ១០ វិ។ ផ្ដល់ពេលសម្រាក!',
        shieldPowerDesc: 'ការពារខ្ទប់ ១០ វិ ពីការខូចខាតទាំងអស់!',
        doublePowerDesc: 'ពិន្ទុ x2 ពីចម្លើយត្រឹមត្រូវ ១០ វិ!',
        powerGlowHint: 'សមីការអានុភាពភ្លឺ — ផ្ដល់អាទិភាពដើម្បីប្រសិទ្ធភាពខ្ពស់!',
        binaryTitle: 'ប្រព័ន្ធគូ (មូលដ្ឋាន ២)',
        binaryPrefix: 'បុព្វបទ៖ ',
        binaryDesc: '។ ប្រើតែ ០ និង ១ ។',
        hexTitle: 'ប្រព័ន្ធដប់ប្រាំមួយ (មូលដ្ឋាន ១៦)',
        hexPrefix: 'បុព្វបទ៖ ',
        hexDesc: '។ ប្រើ ០-៩ និង A-F ។',
        moduloTitle: 'ច្រៃ (%)',
        moduloDesc: 'សំណល់បន្ទាប់ពីការចែក។',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'ប្រព័ន្ធបានគាំ',
        bufferOverflow: 'បានរកឃើញការហូរលើសខ្ទប់។',
        finalScore: 'ពិន្ទុចុងក្រោយ',
        levelReached: 'កម្រិតដែលបានឈានដល់',
        newHighScore: 'ពិន្ទុខ្ពស់ថ្មី!',
        tip: 'គន្លឹះ',
        tipPowerup: 'ប្រយ័ត្នចំពោះសមីការអានុភាពភ្លឺ — យឺត ⏱, ខែល 🛡, និង x2 ⚡ អាចបង្វិលស្ថានការណ៍!',
        tipHealth: 'ចម្លើយត្រឹមត្រូវស្ដារខ្ទប់ម្ដងៗ។ ឡើងកម្រិតរៀងរាល់ ៥០០ XP ដើម្បីបង្កើនជីវិត!',
        reboot: 'ចាប់ប្រព័ន្ធឡើងវិញ',
        returnMenu: 'ត្រឡប់ទៅម៉ឺនុយ',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'វិធីសាស្ត្រហ្វឹកហ្វឺន',
        exitTraining: 'ចេញពីការហ្វឹកហ្វឺន',
        continue: 'បន្ត',
        incorrectKey: 'គ្រាប់ចុចខុស',
        useFinger: 'ប្រើ',
        toPress: 'ដើម្បីចុច',

        // Tutorial step titles
        t1Title: 'ចំណុចប្រទាក់ប្រព័ន្ធ',
        t2Title: 'ឥរិយាបថជួរផ្ទះ',
        t3Title: 'ការឈានដល់លេខ',
        t4Title: 'លំហាត់: ដៃឆ្វេង',
        t5Title: 'លំហាត់: ដៃស្ដាំ',
        t6Title: 'លំហាត់: ចម្រុះ',
        t7Title: 'ការហ្វឹកហ្វឺនបានបញ្ចប់',

        // Tutorial step content
        t1Content: 'សូមស្វាគមន៍, ប្រតិបត្ដិករ! សមីការនិងលំដាប់លេខនឹងធ្លាក់ចុះពីខាងលើ — វាយចម្លើយត្រឹមត្រូវ ហើយចុចគ្មានអ្វីទៀត ដើម្បីបញ្ឈប់ពួកគេ មុននឹងពួកគេបំពានខ្ទប់!',
        t2Content: 'ដាក់ម្រាមមдето​របស់អ្នកនៅជួរផ្ទះ (A-S-D-F និង J-K-L-;)។ នេះជាមូលដ្ឋានប្រតិបត្ដិការ។ ត្រឡប់មកទីនេះវិញរៀងរាល់ការចុចគ្រាប់ចុច!',
        t3Content: 'ដៃបែរពីជួរផ្ទះដើម្បីចុចគ្រាប់ចុចលេខ (1-0)។ រក្សាការផ្ដោតសំខាន់លើអេក្រង់ មិនមែននៅម្រាម!',
        t4Content: 'វាយលេខម្ដងៗដោយប្រើម្រាមដៃឆ្វេងត្រឹមត្រូវដែលបានបង្ហាញ។ គ្រាប់ចុចភ្លឺជាគោលដៅ!',
        t5Content: 'ឥឡូវវ៉ែតទៅដៃស្ដាំ។ វាយលេខម្ដងៗដែលភ្លឺ — ត្រឡប់ទៅជួរផ្ទះបន្ទាប់ពីការចុចនីមួយ!',
        t6Content: 'លំហាត់ចុងក្រោយ — ត្រូវការដៃទាំងពីរ! នេះជាការក្លែងក្លាយល្អបំផុតនៃការលេងពិត! នៅស្ងប់ ហើយវាយឱ្យស្ថែរ!',
        t7Content: 'ប្រព័ន្ធរួចរាល់! គន្លឹះខ្លះៗ មុននឹងអ្នកចូលលេង:\n• ចម្លើយត្រឹមត្រូវស្ដារភាពត្រឹមត្រូវខ្ទប់\n• អានុភាព (យឺត ⏱, ខែល 🛡, x2 ⚡) លេចឡើងនៅសមីការពិសេស — ផ្ដល់អាទិភាពដល់ពួកគេ\n• ឡើងកម្រិតរៀងរាល់ ៥០០ ពិន្ទុ ដើម្បីបង្កើតជីវិត\n• ចុច R ចាប់ផ្ដើមម្ដងទៀត, ESC ម៉ឺនុយ, M បិទសំឡេង',

        // Finger names
        lPinky: 'កូនម្រាមឆ្វេង',
        lRing: 'ម្រាមចិញ្ចៀនឆ្វេង',
        lMiddle: 'ម្រាមកណ្ដាលឆ្វេង',
        lIndex: 'ម្រាមចង្អុលឆ្វេង',
        rIndex: 'ម្រាមចង្អុលស្ដាំ',
        rMiddle: 'ម្រាមកណ្ដាលស្ដាំ',
        rRing: 'ម្រាមចិញ្ចៀនស្ដាំ',
        rPinky: 'កូនម្រាមស្ដាំ',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;
export default translations;
