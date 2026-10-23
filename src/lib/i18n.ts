export type Language = 'en' | 'hi' | 'mr';

export interface TranslationStrings {
  // Navigation
  nav: {
    home: string;
    assistant: string;
    services: string;
    actionPlans: string;
    about: string;
    privacy: string;
    getHelp: string;
    settings: string;
    menu: string;
    close: string;
  };
  // Hero
  hero: {
    headline: string;
    subheadline: string;
    inputPlaceholder: string;
    privacyNote: string;
    submit: string;
    uploadFile: string;
    voiceInput: string;
    stopRecording: string;
  };
  // Examples
  examples: {
    title: string;
    subtitle: string;
    schemes: string;
    schemesDesc: string;
    document: string;
    documentDesc: string;
    disaster: string;
    disasterDesc: string;
    medical: string;
    medicalDesc: string;
    publicServices: string;
    publicServicesDesc: string;
    traffic: string;
    trafficDesc: string;
  };
  // How it works
  howItWorks: {
    title: string;
    step1: string;
    step1Desc: string;
    step2: string;
    step2Desc: string;
    step3: string;
    step3Desc: string;
    step4: string;
    step4Desc: string;
  };
  // Trust
  trust: {
    title: string;
    aiDisclaimer: string;
    sourcesProvided: string;
    officialPriority: string;
    humanSupport: string;
    userControl: string;
  };
  // Assistant
  assistant: {
    title: string;
    newAssessment: string;
    demoMode: string;
    demoBanner: string;
    processing: string;
    situationSummary: string;
    extractedFacts: string;
    uncertainties: string;
    priorityAssessment: string;
    actionPlan: string;
    evidence: string;
    missingInfo: string;
    safetyNotice: string;
    markComplete: string;
    openSource: string;
    copyPlan: string;
    printPlan: string;
    exportPdf: string;
    startNew: string;
    verified: string;
    unverified: string;
    pending: string;
    routine: string;
    timeSensitive: string;
    urgent: string;
    followUpQuestions: string;
    noApiKey: string;
    tryDemo: string;
    configureApi: string;
  };
  // Services
  services: {
    title: string;
    subtitle: string;
    search: string;
    allCategories: string;
    education: string;
    welfare: string;
    disaster: string;
    health: string;
    transport: string;
    identity: string;
    community: string;
    visitWebsite: string;
    eligibility: string;
    documents: string;
    lastChecked: string;
    demoLabel: string;
  };
  // Action Plans
  actionPlans: {
    title: string;
    subtitle: string;
    noPlans: string;
    noPlansDesc: string;
    sessionNotice: string;
    progress: string;
    completed: string;
    viewPlan: string;
    deletePlan: string;
    createdAt: string;
  };
  // About
  about: {
    title: string;
    mission: string;
    approach: string;
    limitations: string;
  };
  // Footer
  footer: {
    tagline: string;
    disclaimer: string;
    accessibility: string;
    madeWith: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    confirm: string;
    back: string;
    next: string;
    search: string;
    filter: string;
    noResults: string;
    required: string;
    optional: string;
    copiedToClipboard: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    nav: {
      home: 'Home',
      assistant: 'AI Assistant',
      services: 'Explore Services',
      actionPlans: 'My Action Plans',
      about: 'About',
      privacy: 'Privacy',
      getHelp: 'Get Help Now',
      settings: 'Settings',
      menu: 'Menu',
      close: 'Close',
    },
    hero: {
      headline: 'Complex problems. Clear next steps.',
      subheadline: 'Turn confusing documents, urgent situations, and complicated public services into clear, personalized actions with AI-powered assistance.',
      inputPlaceholder: 'Describe what\'s happening or tell us what you need help with...',
      privacyNote: 'Share only the information needed to get help. Avoid uploading passwords, identity numbers, or unnecessary sensitive information.',
      submit: 'Get Help',
      uploadFile: 'Upload file',
      voiceInput: 'Voice input',
      stopRecording: 'Stop recording',
    },
    examples: {
      title: 'How can we help?',
      subtitle: 'Select an example to see how CivicBridge AI works',
      schemes: 'Find Government Schemes',
      schemesDesc: 'Discover scholarships, subsidies, and welfare programs you may qualify for based on your circumstances.',
      document: 'Understand a Document',
      documentDesc: 'Upload a confusing letter, notice, or official document and get a clear explanation of what it means.',
      disaster: 'Disaster Preparedness',
      disasterDesc: 'Get safety guidance, emergency contacts, and preparedness checklists for natural disasters.',
      medical: 'Organize Medical Info',
      medicalDesc: 'Upload medical reports to get plain-language summaries and organized health information.',
      publicServices: 'Find Public Services',
      publicServicesDesc: 'Locate relevant government offices, helplines, and public resources near you.',
      traffic: 'Traffic & Weather Updates',
      trafficDesc: 'Understand disruptions and get guidance on alternative routes or safety precautions.',
    },
    howItWorks: {
      title: 'How it works',
      step1: 'Explain your situation',
      step1Desc: 'Type, speak, or upload documents describing what you need help with.',
      step2: 'AI organizes information',
      step2Desc: 'Our AI analyzes your input, extracts key facts, and identifies what matters most.',
      step3: 'Review evidence & steps',
      step3Desc: 'See prioritized actions backed by official sources and verified information.',
      step4: 'Take action',
      step4Desc: 'Follow your personalized action plan with direct links to official resources.',
    },
    trust: {
      title: 'Built with trust & transparency',
      aiDisclaimer: 'AI outputs can be incorrect. Always verify important information with official sources.',
      sourcesProvided: 'Source links are provided when available so you can verify information yourself.',
      officialPriority: 'Official information from government sources always takes precedence over AI suggestions.',
      humanSupport: 'High-risk situations require appropriate human or professional support.',
      userControl: 'You retain full control over your actions. We suggest — you decide.',
    },
    assistant: {
      title: 'AI Assistant',
      newAssessment: 'New Assessment',
      demoMode: 'Demo Mode',
      demoBanner: 'This is a demonstration with sample data. Results are not from a live AI analysis.',
      processing: 'Analyzing your situation...',
      situationSummary: 'Situation Summary',
      extractedFacts: 'Key Facts',
      uncertainties: 'Uncertainties',
      priorityAssessment: 'Priority Assessment',
      actionPlan: 'Recommended Action Plan',
      evidence: 'Evidence & Sources',
      missingInfo: 'Additional Information Needed',
      safetyNotice: 'Important Notice',
      markComplete: 'Mark complete',
      openSource: 'Open source',
      copyPlan: 'Copy plan',
      printPlan: 'Print plan',
      exportPdf: 'Export PDF',
      startNew: 'Start new assessment',
      verified: 'Verified',
      unverified: 'Unverified',
      pending: 'Pending',
      routine: 'Routine',
      timeSensitive: 'Time-sensitive',
      urgent: 'Urgent',
      followUpQuestions: 'We need more information',
      noApiKey: 'Gemini API key not configured. The AI assistant requires a valid API key.',
      tryDemo: 'Try Demo Mode',
      configureApi: 'See setup instructions to configure your API key.',
    },
    services: {
      title: 'Public Services Directory',
      subtitle: 'Find verified government services, helplines, and resources',
      search: 'Search services...',
      allCategories: 'All Categories',
      education: 'Education & Scholarships',
      welfare: 'Public Welfare',
      disaster: 'Disaster Preparedness',
      health: 'Health Information',
      transport: 'Transport & Accessibility',
      identity: 'Identity & Documentation',
      community: 'Community Support',
      visitWebsite: 'Visit Website',
      eligibility: 'Eligibility',
      documents: 'Required Documents',
      lastChecked: 'Last checked',
      demoLabel: 'Sample Entry',
    },
    actionPlans: {
      title: 'My Action Plans',
      subtitle: 'Track and manage your personalized action plans',
      noPlans: 'No action plans yet',
      noPlansDesc: 'Start a conversation with the AI Assistant to generate your first action plan.',
      sessionNotice: 'Plans are stored in your browser session. They will be lost when you close this tab.',
      progress: 'Progress',
      completed: 'completed',
      viewPlan: 'View Plan',
      deletePlan: 'Delete Plan',
      createdAt: 'Created',
    },
    about: {
      title: 'About CivicBridge AI',
      mission: 'Our Mission',
      approach: 'Our Approach',
      limitations: 'Limitations',
    },
    footer: {
      tagline: 'Bridging the gap between citizens and public services',
      disclaimer: 'CivicBridge AI provides informational guidance only. It is not a substitute for professional advice, emergency services, or official government processes.',
      accessibility: 'Accessibility',
      madeWith: 'Built with care for public benefit',
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try again',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      filter: 'Filter',
      noResults: 'No results found',
      required: 'Required',
      optional: 'Optional',
      copiedToClipboard: 'Copied to clipboard',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      assistant: 'AI सहायक',
      services: 'सेवाएँ',
      actionPlans: 'कार्य योजनाएँ',
      about: 'हमारे बारे में',
      privacy: 'गोपनीयता',
      getHelp: 'सहायता प्राप्त करें',
      settings: 'सेटिंग्स',
      menu: 'मेनू',
      close: 'बंद करें',
    },
    hero: {
      headline: 'जटिल समस्याएँ। स्पष्ट अगले कदम।',
      subheadline: 'भ्रामक दस्तावेज़ों, आपातकालीन स्थितियों, और जटिल सरकारी सेवाओं को AI-सहायता से स्पष्ट, व्यक्तिगत कार्य योजनाओं में बदलें।',
      inputPlaceholder: 'अपनी स्थिति बताएं या हमें बताएं कि आपको किस सहायता की आवश्यकता है...',
      privacyNote: 'केवल वही जानकारी साझा करें जो सहायता के लिए आवश्यक हो। पासवर्ड, पहचान संख्या, या अनावश्यक संवेदनशील जानकारी अपलोड न करें।',
      submit: 'सहायता प्राप्त करें',
      uploadFile: 'फ़ाइल अपलोड करें',
      voiceInput: 'वॉइस इनपुट',
      stopRecording: 'रिकॉर्डिंग रोकें',
    },
    examples: {
      title: 'हम कैसे मदद कर सकते हैं?',
      subtitle: 'CivicBridge AI कैसे काम करता है यह देखने के लिए एक उदाहरण चुनें',
      schemes: 'सरकारी योजनाएँ खोजें',
      schemesDesc: 'अपनी परिस्थितियों के आधार पर छात्रवृत्ति, सब्सिडी और कल्याण कार्यक्रम खोजें।',
      document: 'दस्तावेज़ समझें',
      documentDesc: 'भ्रामक पत्र, नोटिस, या आधिकारिक दस्तावेज़ अपलोड करें और स्पष्ट व्याख्या प्राप्त करें।',
      disaster: 'आपदा तैयारी',
      disasterDesc: 'प्राकृतिक आपदाओं के लिए सुरक्षा मार्गदर्शन, आपातकालीन संपर्क और तैयारी चेकलिस्ट।',
      medical: 'चिकित्सा जानकारी व्यवस्थित करें',
      medicalDesc: 'चिकित्सा रिपोर्ट अपलोड करें और सरल भाषा में सारांश प्राप्त करें।',
      publicServices: 'सार्वजनिक सेवाएँ खोजें',
      publicServicesDesc: 'अपने आस-पास के संबंधित सरकारी कार्यालय, हेल्पलाइन और सार्वजनिक संसाधन खोजें।',
      traffic: 'यातायात और मौसम',
      trafficDesc: 'व्यवधानों को समझें और वैकल्पिक मार्गों या सुरक्षा सावधानियों पर मार्गदर्शन प्राप्त करें।',
    },
    howItWorks: {
      title: 'यह कैसे काम करता है',
      step1: 'अपनी स्थिति बताएं',
      step1Desc: 'टाइप करें, बोलें, या दस्तावेज़ अपलोड करें।',
      step2: 'AI जानकारी व्यवस्थित करता है',
      step2Desc: 'AI आपके इनपुट का विश्लेषण करता है और महत्वपूर्ण तथ्य निकालता है।',
      step3: 'साक्ष्य और कदम देखें',
      step3Desc: 'आधिकारिक स्रोतों से समर्थित प्राथमिकता वाले कार्य देखें।',
      step4: 'कार्रवाई करें',
      step4Desc: 'आधिकारिक संसाधनों के सीधे लिंक के साथ अपनी कार्य योजना का पालन करें।',
    },
    trust: {
      title: 'विश्वास और पारदर्शिता के साथ निर्मित',
      aiDisclaimer: 'AI आउटपुट गलत हो सकते हैं। महत्वपूर्ण जानकारी हमेशा आधिकारिक स्रोतों से सत्यापित करें।',
      sourcesProvided: 'स्रोत लिंक उपलब्ध होने पर प्रदान किए जाते हैं।',
      officialPriority: 'सरकारी स्रोतों की आधिकारिक जानकारी हमेशा AI सुझावों पर प्राथमिकता रखती है।',
      humanSupport: 'उच्च-जोखिम स्थितियों में उपयुक्त मानवीय या पेशेवर सहायता आवश्यक है।',
      userControl: 'आप अपने कार्यों पर पूर्ण नियंत्रण रखते हैं। हम सुझाव देते हैं — आप निर्णय लें।',
    },
    assistant: {
      title: 'AI सहायक',
      newAssessment: 'नया मूल्यांकन',
      demoMode: 'डेमो मोड',
      demoBanner: 'यह नमूना डेटा वाला प्रदर्शन है। परिणाम लाइव AI विश्लेषण से नहीं हैं।',
      processing: 'आपकी स्थिति का विश्लेषण हो रहा है...',
      situationSummary: 'स्थिति सारांश',
      extractedFacts: 'मुख्य तथ्य',
      uncertainties: 'अनिश्चितताएँ',
      priorityAssessment: 'प्राथमिकता मूल्यांकन',
      actionPlan: 'अनुशंसित कार्य योजना',
      evidence: 'साक्ष्य और स्रोत',
      missingInfo: 'अतिरिक्त जानकारी आवश्यक',
      safetyNotice: 'महत्वपूर्ण सूचना',
      markComplete: 'पूर्ण करें',
      openSource: 'स्रोत खोलें',
      copyPlan: 'योजना कॉपी करें',
      printPlan: 'प्रिंट करें',
      exportPdf: 'PDF निर्यात',
      startNew: 'नया मूल्यांकन शुरू करें',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      pending: 'लंबित',
      routine: 'सामान्य',
      timeSensitive: 'समय-संवेदनशील',
      urgent: 'तत्काल',
      followUpQuestions: 'हमें और जानकारी चाहिए',
      noApiKey: 'Gemini API कुंजी कॉन्फ़िगर नहीं है।',
      tryDemo: 'डेमो मोड आज़माएं',
      configureApi: 'API कुंजी कॉन्फ़िगर करने के लिए सेटअप निर्देश देखें।',
    },
    services: {
      title: 'सार्वजनिक सेवा निर्देशिका',
      subtitle: 'सत्यापित सरकारी सेवाएँ, हेल्पलाइन और संसाधन खोजें',
      search: 'सेवाएँ खोजें...',
      allCategories: 'सभी श्रेणियाँ',
      education: 'शिक्षा और छात्रवृत्ति',
      welfare: 'सार्वजनिक कल्याण',
      disaster: 'आपदा तैयारी',
      health: 'स्वास्थ्य जानकारी',
      transport: 'परिवहन और सुलभता',
      identity: 'पहचान और दस्तावेज़ीकरण',
      community: 'सामुदायिक सहायता',
      visitWebsite: 'वेबसाइट देखें',
      eligibility: 'पात्रता',
      documents: 'आवश्यक दस्तावेज़',
      lastChecked: 'अंतिम जाँच',
      demoLabel: 'नमूना प्रविष्टि',
    },
    actionPlans: {
      title: 'मेरी कार्य योजनाएँ',
      subtitle: 'अपनी व्यक्तिगत कार्य योजनाओं को ट्रैक और प्रबंधित करें',
      noPlans: 'अभी कोई कार्य योजना नहीं',
      noPlansDesc: 'अपनी पहली कार्य योजना बनाने के लिए AI सहायक से बात करें।',
      sessionNotice: 'योजनाएँ आपके ब्राउज़र सत्र में संग्रहीत हैं। टैब बंद करने पर ये खो जाएंगी।',
      progress: 'प्रगति',
      completed: 'पूर्ण',
      viewPlan: 'योजना देखें',
      deletePlan: 'योजना हटाएं',
      createdAt: 'बनाई गई',
    },
    about: {
      title: 'CivicBridge AI के बारे में',
      mission: 'हमारा उद्देश्य',
      approach: 'हमारा दृष्टिकोण',
      limitations: 'सीमाएँ',
    },
    footer: {
      tagline: 'नागरिकों और सार्वजनिक सेवाओं के बीच सेतु',
      disclaimer: 'CivicBridge AI केवल सूचनात्मक मार्गदर्शन प्रदान करता है।',
      accessibility: 'सुलभता',
      madeWith: 'सार्वजनिक लाभ के लिए निर्मित',
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हो गया',
      retry: 'पुनः प्रयास करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      back: 'वापस',
      next: 'अगला',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      noResults: 'कोई परिणाम नहीं',
      required: 'आवश्यक',
      optional: 'वैकल्पिक',
      copiedToClipboard: 'क्लिपबोर्ड पर कॉपी किया',
    },
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      assistant: 'AI सहाय्यक',
      services: 'सेवा',
      actionPlans: 'कृती योजना',
      about: 'आमच्याबद्दल',
      privacy: 'गोपनीयता',
      getHelp: 'मदत घ्या',
      settings: 'सेटिंग्ज',
      menu: 'मेनू',
      close: 'बंद करा',
    },
    hero: {
      headline: 'गुंतागुंतीच्या समस्या. स्पष्ट पुढील पावले.',
      subheadline: 'गोंधळात टाकणारे दस्तऐवज, तातडीच्या परिस्थिती आणि जटिल सार्वजनिक सेवा AI-सहाय्याने स्पष्ट, वैयक्तिक कृती योजनांमध्ये बदला.',
      inputPlaceholder: 'तुमची परिस्थिती सांगा किंवा तुम्हाला कशाची मदत हवी ते सांगा...',
      privacyNote: 'मदतीसाठी आवश्यक तेवढीच माहिती शेअर करा. पासवर्ड, ओळख क्रमांक किंवा अनावश्यक संवेदनशील माहिती अपलोड करू नका.',
      submit: 'मदत मिळवा',
      uploadFile: 'फाइल अपलोड',
      voiceInput: 'व्हॉइस इनपुट',
      stopRecording: 'रेकॉर्डिंग थांबवा',
    },
    examples: {
      title: 'आम्ही कशी मदत करू शकतो?',
      subtitle: 'CivicBridge AI कसे कार्य करते ते पाहण्यासाठी एक उदाहरण निवडा',
      schemes: 'सरकारी योजना शोधा',
      schemesDesc: 'तुमच्या परिस्थितीनुसार शिष्यवृत्ती, अनुदान आणि कल्याण कार्यक्रम शोधा.',
      document: 'दस्तऐवज समजून घ्या',
      documentDesc: 'गोंधळात टाकणारे पत्र, सूचना किंवा अधिकृत दस्तऐवज अपलोड करा आणि स्पष्ट स्पष्टीकरण मिळवा.',
      disaster: 'आपत्ती तयारी',
      disasterDesc: 'नैसर्गिक आपत्तींसाठी सुरक्षा मार्गदर्शन, आपत्कालीन संपर्क आणि तयारी चेकलिस्ट.',
      medical: 'वैद्यकीय माहिती व्यवस्थित करा',
      medicalDesc: 'वैद्यकीय अहवाल अपलोड करा आणि सोप्या भाषेत सारांश मिळवा.',
      publicServices: 'सार्वजनिक सेवा शोधा',
      publicServicesDesc: 'जवळचे संबंधित सरकारी कार्यालये, हेल्पलाइन आणि सार्वजनिक संसाधने शोधा.',
      traffic: 'वाहतूक आणि हवामान',
      trafficDesc: 'व्यत्यय समजून घ्या आणि पर्यायी मार्ग किंवा सुरक्षा सावधानींबद्दल मार्गदर्शन मिळवा.',
    },
    howItWorks: {
      title: 'हे कसे कार्य करते',
      step1: 'तुमची परिस्थिती सांगा',
      step1Desc: 'टाइप करा, बोला किंवा दस्तऐवज अपलोड करा.',
      step2: 'AI माहिती व्यवस्थित करतो',
      step2Desc: 'AI तुमच्या इनपुटचे विश्लेषण करतो आणि महत्त्वाची तथ्ये काढतो.',
      step3: 'पुरावे आणि पावले पहा',
      step3Desc: 'अधिकृत स्रोतांनी समर्थित प्राधान्य कृती पहा.',
      step4: 'कृती करा',
      step4Desc: 'अधिकृत संसाधनांच्या थेट लिंक्ससह तुमच्या कृती योजनेचे पालन करा.',
    },
    trust: {
      title: 'विश्वास आणि पारदर्शकतेसह बांधलेले',
      aiDisclaimer: 'AI आउटपुट चुकीचे असू शकतात. महत्त्वाची माहिती नेहमी अधिकृत स्रोतांकडून सत्यापित करा.',
      sourcesProvided: 'स्रोत लिंक्स उपलब्ध असताना दिले जातात.',
      officialPriority: 'सरकारी स्रोतांकडील अधिकृत माहिती नेहमी AI सूचनांपेक्षा प्राधान्य घेते.',
      humanSupport: 'उच्च-जोखीम परिस्थितींमध्ये योग्य मानवी किंवा व्यावसायिक सहाय्य आवश्यक.',
      userControl: 'तुमच्या कृतींवर तुमचे पूर्ण नियंत्रण. आम्ही सुचवतो — तुम्ही ठरवा.',
    },
    assistant: {
      title: 'AI सहाय्यक',
      newAssessment: 'नवीन मूल्यांकन',
      demoMode: 'डेमो मोड',
      demoBanner: 'हा नमुना डेटासह प्रात्यक्षिक आहे. निकाल लाइव AI विश्लेषणातून नाहीत.',
      processing: 'तुमच्या परिस्थितीचे विश्लेषण होत आहे...',
      situationSummary: 'परिस्थिती सारांश',
      extractedFacts: 'मुख्य तथ्ये',
      uncertainties: 'अनिश्चितता',
      priorityAssessment: 'प्राधान्य मूल्यांकन',
      actionPlan: 'शिफारस केलेली कृती योजना',
      evidence: 'पुरावे आणि स्रोत',
      missingInfo: 'अतिरिक्त माहिती आवश्यक',
      safetyNotice: 'महत्त्वाची सूचना',
      markComplete: 'पूर्ण करा',
      openSource: 'स्रोत उघडा',
      copyPlan: 'योजना कॉपी करा',
      printPlan: 'प्रिंट करा',
      exportPdf: 'PDF निर्यात',
      startNew: 'नवीन मूल्यांकन सुरू करा',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      pending: 'प्रलंबित',
      routine: 'नियमित',
      timeSensitive: 'वेळ-संवेदनशील',
      urgent: 'तातडी',
      followUpQuestions: 'आम्हाला अधिक माहिती हवी',
      noApiKey: 'Gemini API की कॉन्फिगर केलेली नाही.',
      tryDemo: 'डेमो मोड वापरा',
      configureApi: 'API की कॉन्फिगर करण्यासाठी सेटअप सूचना पहा.',
    },
    services: {
      title: 'सार्वजनिक सेवा निर्देशिका',
      subtitle: 'सत्यापित सरकारी सेवा, हेल्पलाइन आणि संसाधने शोधा',
      search: 'सेवा शोधा...',
      allCategories: 'सर्व श्रेणी',
      education: 'शिक्षण आणि शिष्यवृत्ती',
      welfare: 'सार्वजनिक कल्याण',
      disaster: 'आपत्ती तयारी',
      health: 'आरोग्य माहिती',
      transport: 'वाहतूक आणि सुलभता',
      identity: 'ओळख आणि दस्तऐवजीकरण',
      community: 'सामुदायिक सहाय्य',
      visitWebsite: 'वेबसाइट भेट द्या',
      eligibility: 'पात्रता',
      documents: 'आवश्यक दस्तऐवज',
      lastChecked: 'शेवटची तपासणी',
      demoLabel: 'नमुना नोंद',
    },
    actionPlans: {
      title: 'माझ्या कृती योजना',
      subtitle: 'तुमच्या वैयक्तिक कृती योजनांचा मागोवा घ्या',
      noPlans: 'अद्याप कोणतीही कृती योजना नाही',
      noPlansDesc: 'तुमची पहिली कृती योजना तयार करण्यासाठी AI सहाय्यकाशी बोला.',
      sessionNotice: 'योजना तुमच्या ब्राउझर सत्रात साठवल्या आहेत. टॅब बंद केल्यावर त्या हरवतील.',
      progress: 'प्रगती',
      completed: 'पूर्ण',
      viewPlan: 'योजना पहा',
      deletePlan: 'योजना हटवा',
      createdAt: 'तयार केली',
    },
    about: {
      title: 'CivicBridge AI बद्दल',
      mission: 'आमचे उद्दिष्ट',
      approach: 'आमचा दृष्टिकोन',
      limitations: 'मर्यादा',
    },
    footer: {
      tagline: 'नागरिक आणि सार्वजनिक सेवांमधील दुवा',
      disclaimer: 'CivicBridge AI केवळ माहितीपूर्ण मार्गदर्शन प्रदान करते.',
      accessibility: 'सुलभता',
      madeWith: 'सार्वजनिक लाभासाठी बांधलेले',
    },
    common: {
      loading: 'लोड होत आहे...',
      error: 'काहीतरी चूक झाली',
      retry: 'पुन्हा प्रयत्न करा',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      delete: 'हटवा',
      confirm: 'पुष्टी करा',
      back: 'मागे',
      next: 'पुढे',
      search: 'शोधा',
      filter: 'फिल्टर',
      noResults: 'कोणतेही परिणाम नाहीत',
      required: 'आवश्यक',
      optional: 'ऐच्छिक',
      copiedToClipboard: 'क्लिपबोर्डवर कॉपी केले',
    },
  },
};
