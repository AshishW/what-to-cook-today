import { LanguageCode } from '@/types/types';

type TranslationStrings = {
  // Navigation
  feed: string;
  search: string;
  settings: string;

  // Feed Screen
  whatsCookingToday: string;
  noItemsYet: string;
  addFirstItem: string;
  allCategories: string;

  // Categories
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;

  // Item Detail
  description: string;
  tags: string;
  edit: string;
  delete: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  cancel: string;
  confirm: string;

  // Item Form
  createItem: string;
  editItem: string;
  uploadImage: string;
  replaceImage: string;
  title: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  addTag: string;
  tagPlaceholder: string;
  category: string;
  save: string;
  titleRequired: string;

  // Search Screen
  searchPlaceholder: string;
  filterByTags: string;
  searchResults: string;
  noResults: string;

  // Settings Screen
  generalSettings: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  language: string;
  selectLanguage: string;
  dataManagement: string;
  importData: string;
  importDataDesc: string;
  exportData: string;
  exportDataDesc: string;
  shareMenu: string;
  shareMenuDesc: string;
  importSuccess: string;
  exportSuccess: string;
  error: string;
};

const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    feed: 'Feed',
    search: 'Search',
    settings: 'Settings',
    whatsCookingToday: "What's Cooking Today",
    noItemsYet: 'No items yet',
    addFirstItem: 'Tap + to add your first dish!',
    allCategories: 'All',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    description: 'Description',
    tags: 'Tags',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirmTitle: 'Delete Item',
    deleteConfirmMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    createItem: 'Create Item',
    editItem: 'Edit Item',
    uploadImage: 'Upload Image',
    replaceImage: 'Replace Image',
    title: 'Title',
    titlePlaceholder: 'e.g. Mushroom Risotto',
    descriptionPlaceholder: 'Describe your dish...',
    addTag: 'Add Tag',
    tagPlaceholder: 'e.g. tomato',
    category: 'Category',
    save: 'Save',
    titleRequired: 'Title is required',
    searchPlaceholder: 'Search tags, items...',
    filterByTags: 'Filter by Tags',
    searchResults: 'Search Results',
    noResults: 'No results found',
    generalSettings: 'General Settings',
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    language: 'Language',
    selectLanguage: 'Select Language',
    dataManagement: 'Data Management',
    importData: 'Import Data',
    importDataDesc: 'Upload backup',
    exportData: 'Export Data',
    exportDataDesc: 'Save data locally',
    shareMenu: 'Share Menu',
    shareMenuDesc: 'Share your food collection',
    importSuccess: 'Data imported successfully!',
    exportSuccess: 'Data exported successfully!',
    error: 'Error',
  },
  hi: {
    feed: 'फ़ीड',
    search: 'खोजें',
    settings: 'सेटिंग्स',
    whatsCookingToday: 'आज क्या बन रहा है',
    noItemsYet: 'अभी कोई आइटम नहीं',
    addFirstItem: 'अपना पहला व्यंजन जोड़ने के लिए + दबाएं!',
    allCategories: 'सभी',
    breakfast: 'नाश्ता',
    lunch: 'दोपहर का भोजन',
    dinner: 'रात का भोजन',
    snack: 'स्नैक',
    description: 'विवरण',
    tags: 'टैग',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    deleteConfirmTitle: 'आइटम हटाएं',
    deleteConfirmMessage: 'क्या आप वाकई इस आइटम को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती.',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    createItem: 'आइटम बनाएं',
    editItem: 'आइटम संपादित करें',
    uploadImage: 'छवि अपलोड करें',
    replaceImage: 'छवि बदलें',
    title: 'शीर्षक',
    titlePlaceholder: 'जैसे मशरूम रिसोट्टो',
    descriptionPlaceholder: 'अपने व्यंजन का वर्णन करें...',
    addTag: 'टैग जोड़ें',
    tagPlaceholder: 'जैसे टमाटर',
    category: 'श्रेणी',
    save: 'सहेजें',
    titleRequired: 'शीर्षक आवश्यक है',
    searchPlaceholder: 'टैग, आइटम खोजें...',
    filterByTags: 'टैग द्वारा फ़िल्टर करें',
    searchResults: 'खोज परिणाम',
    noResults: 'कोई परिणाम नहीं मिला',
    generalSettings: 'सामान्य सेटिंग्स',
    theme: 'थीम',
    lightMode: 'लाइट',
    darkMode: 'डार्क',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    dataManagement: 'डेटा प्रबंधन',
    importData: 'डेटा आयात करें',
    importDataDesc: 'बैकअप अपलोड करें',
    exportData: 'डेटा निर्यात करें',
    exportDataDesc: 'डेटा स्थानीय रूप से सहेजें',
    shareMenu: 'मेनू साझा करें',
    shareMenuDesc: 'अपना फ़ूड संग्रह साझा करें',
    importSuccess: 'डेटा सफलतापूर्वक आयात किया गया!',
    exportSuccess: 'डेटा सफलतापूर्वक निर्यात किया गया!',
    error: 'त्रुटि',
  },
  mr: {
    feed: 'फीड',
    search: 'शोधा',
    settings: 'सेटिंग्ज',
    whatsCookingToday: 'आज काय शिजतंय',
    noItemsYet: 'अजून कोणतीही वस्तू नाही',
    addFirstItem: 'तुमचा पहिला पदार्थ जोडण्यासाठी + दाबा!',
    allCategories: 'सर्व',
    breakfast: 'न्याहारी',
    lunch: 'दुपारचे जेवण',
    dinner: 'रात्रीचे जेवण',
    snack: 'स्नॅक',
    description: 'वर्णन',
    tags: 'टॅग',
    edit: 'संपादित करा',
    delete: 'हटवा',
    deleteConfirmTitle: 'वस्तू हटवा',
    deleteConfirmMessage: 'तुम्हाला खात्री आहे की तुम्ही ही वस्तू हटवू इच्छिता? ही क्रिया पूर्ववत केली जाऊ शकत नाही.',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    createItem: 'वस्तू तयार करा',
    editItem: 'वस्तू संपादित करा',
    uploadImage: 'प्रतिमा अपलोड करा',
    replaceImage: 'प्रतिमा बदला',
    title: 'शीर्षक',
    titlePlaceholder: 'उदा. मशरूम रिसोट्टो',
    descriptionPlaceholder: 'तुमच्या पदार्थाचे वर्णन करा...',
    addTag: 'टॅग जोडा',
    tagPlaceholder: 'उदा. टोमॅटो',
    category: 'वर्ग',
    save: 'जतन करा',
    titleRequired: 'शीर्षक आवश्यक आहे',
    searchPlaceholder: 'टॅग, वस्तू शोधा...',
    filterByTags: 'टॅगद्वारे फिल्टर करा',
    searchResults: 'शोध परिणाम',
    noResults: 'कोणतेही परिणाम सापडले नाहीत',
    generalSettings: 'सामान्य सेटिंग्ज',
    theme: 'थीम',
    lightMode: 'लाइट',
    darkMode: 'डार्क',
    language: 'भाषा',
    selectLanguage: 'भाषा निवडा',
    dataManagement: 'डेटा व्यवस्थापन',
    importData: 'डेटा आयात करा',
    importDataDesc: 'बॅकअप अपलोड करा',
    exportData: 'डेटा निर्यात करा',
    exportDataDesc: 'डेटा स्थानिकरित्या जतन करा',
    shareMenu: 'मेनू शेअर करा',
    shareMenuDesc: 'तुमचा खाद्य संग्रह शेअर करा',
    importSuccess: 'डेटा यशस्वीरित्या आयात केला!',
    exportSuccess: 'डेटा यशस्वीरित्या निर्यात केला!',
    error: 'त्रुटी',
  },
  fr: {
    feed: 'Fil',
    search: 'Rechercher',
    settings: 'Paramètres',
    whatsCookingToday: "Qu'est-ce qu'on cuisine aujourd'hui",
    noItemsYet: "Pas encore d'éléments",
    addFirstItem: 'Appuyez sur + pour ajouter votre premier plat !',
    allCategories: 'Tout',
    breakfast: 'Petit-déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snack: 'Collation',
    description: 'Description',
    tags: 'Étiquettes',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteConfirmTitle: "Supprimer l'élément",
    deleteConfirmMessage: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    createItem: 'Créer un élément',
    editItem: "Modifier l'élément",
    uploadImage: 'Télécharger une image',
    replaceImage: "Remplacer l'image",
    title: 'Titre',
    titlePlaceholder: 'ex. Risotto aux champignons',
    descriptionPlaceholder: 'Décrivez votre plat...',
    addTag: 'Ajouter une étiquette',
    tagPlaceholder: 'ex. tomate',
    category: 'Catégorie',
    save: 'Enregistrer',
    titleRequired: 'Le titre est requis',
    searchPlaceholder: 'Rechercher des étiquettes, éléments...',
    filterByTags: 'Filtrer par étiquettes',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun résultat trouvé',
    generalSettings: 'Paramètres généraux',
    theme: 'Thème',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    language: 'Langue',
    selectLanguage: 'Sélectionner la langue',
    dataManagement: 'Gestion des données',
    importData: 'Importer des données',
    importDataDesc: 'Télécharger une sauvegarde',
    exportData: 'Exporter des données',
    exportDataDesc: 'Sauvegarder localement',
    shareMenu: 'Partager le menu',
    shareMenuDesc: 'Partagez votre collection culinaire',
    importSuccess: 'Données importées avec succès !',
    exportSuccess: 'Données exportées avec succès !',
    error: 'Erreur',
  },
  es: {
    feed: 'Inicio',
    search: 'Buscar',
    settings: 'Ajustes',
    whatsCookingToday: '¿Qué se cocina hoy?',
    noItemsYet: 'Aún no hay elementos',
    addFirstItem: '¡Toca + para agregar tu primer plato!',
    allCategories: 'Todo',
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
    snack: 'Merienda',
    description: 'Descripción',
    tags: 'Etiquetas',
    edit: 'Editar',
    delete: 'Eliminar',
    deleteConfirmTitle: 'Eliminar elemento',
    deleteConfirmMessage: '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    createItem: 'Crear elemento',
    editItem: 'Editar elemento',
    uploadImage: 'Subir imagen',
    replaceImage: 'Reemplazar imagen',
    title: 'Título',
    titlePlaceholder: 'ej. Risotto de champiñones',
    descriptionPlaceholder: 'Describe tu plato...',
    addTag: 'Agregar etiqueta',
    tagPlaceholder: 'ej. tomate',
    category: 'Categoría',
    save: 'Guardar',
    titleRequired: 'El título es obligatorio',
    searchPlaceholder: 'Buscar etiquetas, elementos...',
    filterByTags: 'Filtrar por etiquetas',
    searchResults: 'Resultados de búsqueda',
    noResults: 'No se encontraron resultados',
    generalSettings: 'Ajustes generales',
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    language: 'Idioma',
    selectLanguage: 'Seleccionar idioma',
    dataManagement: 'Gestión de datos',
    importData: 'Importar datos',
    importDataDesc: 'Cargar copia de seguridad',
    exportData: 'Exportar datos',
    exportDataDesc: 'Guardar datos localmente',
    shareMenu: 'Compartir menú',
    shareMenuDesc: 'Comparte tu colección de comida',
    importSuccess: '¡Datos importados correctamente!',
    exportSuccess: '¡Datos exportados correctamente!',
    error: 'Error',
  },
};

export function t(key: keyof TranslationStrings, lang: LanguageCode): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function getCategoryTranslation(category: string, lang: LanguageCode): string {
  const key = category.toLowerCase() as keyof TranslationStrings;
  return t(key, lang);
}
