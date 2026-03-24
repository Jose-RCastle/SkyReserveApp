import { I18n } from "i18n-js";

const i18n = new I18n({
  es: {
    loginTitle: "SkyReserve",
    loginSubtitle: "Sistema de Reservación de Vuelos",
    emailPlaceholder: "Ingrese su correo",
    passwordPlaceholder: "Ingrese su contraseña",
    loginButton: "Iniciar sesión",
    noAccount: "¿No te has registrado?",
    createAccount: "Crear cuenta",
    loginFailed: "No se pudo iniciar sesión.",

    registerTitle: "Crear cuenta",
    registerSubtitle: "Regístrate para reservar tus vuelos",
    firstNamePlaceholder: "Ingrese su nombre",
    lastNamePlaceholder: "Ingrese su apellido",
    agePlaceholder: "Ingrese su edad",
    phonePlaceholder: "Ingrese su teléfono",
    registerButton: "Registrarse",
    cancelButton: "Cancelar",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    loginHere: "Iniciar sesión",
    userCouldNotBeCreated: "No se pudo crear el usuario.",
    registerCouldNotBeCompleted: "No se pudo completar el registro.",

    requiredFields: "Campos obligatorios",
    completeAllFields: "Por favor completa todos los campos.",
    invalidPassword: "Contraseña inválida",
    passwordMin: "La contraseña debe tener al menos 6 caracteres.",
    invalidAge: "Edad inválida",
    validAge: "Ingresa una edad válida.",
    registrationSuccess: "Registro exitoso",
    accountCreated: "Tu cuenta fue creada correctamente.",
    authError: "Error de autenticación",
    unexpectedError: "Error inesperado",
    genericError: "Error",

    reservationsTitle: "Reservas",
    loadingReservations: "Cargando reservas...",
    emptyReservationsTitle: "¡El mundo te está esperando!",
    emptyReservationsText:
      "Agrega un viaje. Aquí podrás ver la información de los vuelos que hayas reservado.",
    departure: "Salida",
    return: "Regreso",
    reserved: "Reservado",
    cancelReservation: "Cancelar reservación",
    cancelReservationTitle: "Cancelar reservación",
    cancelReservationMessage:
      "¿Estás seguro de que deseas cancelar esta reservación?",
    no: "No",
    yesCancel: "Sí, cancelar",
    success: "Éxito",
    reservationCancelled: "La reservación fue cancelada correctamente.",

    accountTitle: "Cuenta",
    accountInfo: "Ver información de la cuenta",
    logoutTitle: "Cerrar sesión",
    logoutButton: "Salir",
    languageTitle: "Idioma",
    loadingProfile: "Cargando perfil...",
    unavailableEmail: "Correo no disponible",
    userNotFound: "No se encontró el usuario.",
    authenticatedUserNotFound: "No se encontró el usuario autenticado.",
    profileCouldNotBeLoaded: "No se pudo cargar el perfil.",
    languageChangeFailed: "No se pudo cambiar el idioma.",

    accountInfoTitle: "Información de la cuenta",
    firstName: "Nombre",
    lastName: "Apellido",
    age: "Edad",
    phone: "Teléfono",
    email: "Correo",
    loadingInfo: "Cargando información...",
    infoCouldNotBeLoaded: "No se pudo cargar la información.",

    homeHeroTitle: "Encuentra con AppReserve",
    origin: "Origen",
    destination: "Destino",
    selectDestination: "Selecciona un destino",
    passengers: "Pasajeros",
    search: "Buscar vuelo",

    requiredPassengers: "Pasajeros requeridos",
    selectAtLeastOnePassenger: "Selecciona al menos un pasajero.",
    requiredAdult: "Adulto requerido",
    atLeastOneAdult: "Debe viajar al menos un adulto.",

    destinationSelected: "Destino seleccionado",
    destinationAddedToForm: "ha sido agregado al formulario.",
    destinationRequired: "Destino requerido",
    selectDestinationBeforeBooking: "Selecciona un destino antes de reservar.",

    sessionError: "Error de sesión",
    sessionNotFound: "Sesión no encontrada",
    mustLoginToBook: "Debes iniciar sesión para realizar una reservación.",

    saveError: "Error al guardar",
    flightBookedSuccessfully: "El vuelo fue reservado correctamente.",
    reservationCouldNotBeCompleted: "No se pudo completar la reservación.",

    dailyOffers: "Ofertas del día",
    dailyInspiration: "Inspírate con destinos destacados",
    departureFrom: "Salida desde",
    roundTripPriceFrom: "Ida y vuelta desde",

    travelYourWay: "Viaja a tu manera",
    travelYourWaySubtitle:
      "Disfruta una experiencia cómoda, rápida y pensada para ti.",
    bestPrice: "Mejor precio",
    bestPriceDescription:
      "Encuentra tarifas competitivas para tus próximos viajes.",
    inspiringDestinations: "Destinos inspiradores",
    inspiringDestinationsDescription:
      "Explora lugares increíbles y elige tu próxima aventura.",

    flightSummaryTitle: "Resumen de tu vuelo",
    total: "Total",
    reserveFlight: "Reservar vuelo",
    selectDestinationTitle: "Selecciona tu destino",
    selectOriginTitle: "Selecciona tu origen",
  },

  en: {
    loginTitle: "SkyReserve",
    loginSubtitle: "Flight Reservation System",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    loginButton: "Log in",
    noAccount: "Haven't registered yet?",
    createAccount: "Create account",
    loginFailed: "Could not log in.",

    registerTitle: "Create account",
    registerSubtitle: "Sign up to book your flights",
    firstNamePlaceholder: "Enter your first name",
    lastNamePlaceholder: "Enter your last name",
    agePlaceholder: "Enter your age",
    phonePlaceholder: "Enter your phone number",
    registerButton: "Sign up",
    cancelButton: "Cancel",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Log in",
    userCouldNotBeCreated: "The user could not be created.",
    registerCouldNotBeCompleted: "The registration could not be completed.",

    requiredFields: "Required fields",
    completeAllFields: "Please complete all fields.",
    invalidPassword: "Invalid password",
    passwordMin: "Password must be at least 6 characters long.",
    invalidAge: "Invalid age",
    validAge: "Enter a valid age.",
    registrationSuccess: "Registration successful",
    accountCreated: "Your account was created successfully.",
    authError: "Authentication error",
    unexpectedError: "Unexpected error",
    genericError: "Error",

    reservationsTitle: "Reservations",
    loadingReservations: "Loading reservations...",
    emptyReservationsTitle: "The world is waiting for you!",
    emptyReservationsText:
      "Add a trip. Here you will see the information of the flights you have booked.",
    departure: "Departure",
    return: "Return",
    reserved: "Booked",
    cancelReservation: "Cancel reservation",
    cancelReservationTitle: "Cancel reservation",
    cancelReservationMessage:
      "Are you sure you want to cancel this reservation?",
    no: "No",
    yesCancel: "Yes, cancel",
    success: "Success",
    reservationCancelled: "The reservation was cancelled successfully.",

    accountTitle: "Account",
    accountInfo: "View account information",
    logoutTitle: "Log out",
    logoutButton: "Exit",
    languageTitle: "Language",
    loadingProfile: "Loading profile...",
    unavailableEmail: "Email unavailable",
    userNotFound: "User not found.",
    authenticatedUserNotFound: "Authenticated user not found.",
    profileCouldNotBeLoaded: "The profile could not be loaded.",
    languageChangeFailed: "The language could not be changed.",

    accountInfoTitle: "Account information",
    firstName: "First name",
    lastName: "Last name",
    age: "Age",
    phone: "Phone",
    email: "Email",
    loadingInfo: "Loading information...",
    infoCouldNotBeLoaded: "The information could not be loaded.",

    homeHeroTitle: "Find with AppReserve",
    origin: "Origin",
    destination: "Destination",
    selectDestination: "Select a destination",
    passengers: "Passengers",
    search: "Search flight",

    requiredPassengers: "Passengers required",
    selectAtLeastOnePassenger: "Select at least one passenger.",
    requiredAdult: "Adult required",
    atLeastOneAdult: "At least one adult must travel.",

    destinationSelected: "Destination selected",
    destinationAddedToForm: "has been added to the form.",
    destinationRequired: "Destination required",
    selectDestinationBeforeBooking: "Select a destination before booking.",

    sessionError: "Session error",
    sessionNotFound: "Session not found",
    mustLoginToBook: "You must log in to make a reservation.",

    saveError: "Save error",
    flightBookedSuccessfully: "The flight was booked successfully.",
    reservationCouldNotBeCompleted:
      "The reservation could not be completed.",

    dailyOffers: "Today's offers",
    dailyInspiration: "Get inspired by featured destinations",
    departureFrom: "Departure from",
    roundTripPriceFrom: "Round trip from",

    travelYourWay: "Travel your way",
    travelYourWaySubtitle:
      "Enjoy a comfortable, fast experience designed for you.",
    bestPrice: "Best price",
    bestPriceDescription:
      "Find competitive fares for your next trips.",
    inspiringDestinations: "Inspiring destinations",
    inspiringDestinationsDescription:
      "Explore amazing places and choose your next adventure.",

    flightSummaryTitle: "Your flight summary",
    total: "Total",
    reserveFlight: "Book flight",
    selectDestinationTitle: "Select your destination",
    selectOriginTitle: "Select your origin",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "es";

export const setI18nLanguage = (language: "es" | "en") => {
  i18n.locale = language;
};

export default i18n;