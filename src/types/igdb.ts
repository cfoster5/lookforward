/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AgeRating {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * The organization that has issued a specific rating
   * 1: ESRB
   * 2: PEGI
   * 3: CERO
   * 4: USK
   * 5: GRAC
   * 6: CLASS_IND
   * 7: ACB
   */
  category?: AgeRatingCategoryEnums;
  /** Array of Age Rating Content Description IDs */
  content_descriptions?: any[];
  /**
   * The age rating assigned by the organization
   * 1: Three
   * 2: Seven
   * 3: Twelve
   * 4: Sixteen
   * 5: Eighteen
   * 6: RP
   * 7: EC
   * 8: E
   * 9: E10
   * 10: T
   * 11: M
   * 12: AO
   * 13: CERO_A
   * 14: CERO_B
   * 15: CERO_C
   * 16: CERO_D
   * 17: CERO_Z
   * 18: USK_0
   * 19: USK_6
   * 20: USK_12
   * 21: USK_16
   * 22: USK_18
   * 23: GRAC_ALL
   * 24: GRAC_Twelve
   * 25: GRAC_Fifteen
   * 26: GRAC_Eighteen
   * 27: GRAC_TESTING
   * 28: CLASS_IND_L
   * 29: CLASS_IND_Ten
   * 30: CLASS_IND_Twelve
   * 31: CLASS_IND_Fourteen
   * 32: CLASS_IND_Sixteen
   * 33: CLASS_IND_Eighteen
   * 34: ACB_G
   * 35: ACB_PG
   * 36: ACB_M
   * 37: ACB_MA15
   * 38: ACB_R18
   * 39: ACB_RC
   */
  rating?: AgeRatingEnums;
  /** The rating category from the organization */
  rating_category?: AgeRatingCategory;
  /** Age Rating according to various rating organisations */
  organization?: AgeRatingOrganization;
  /**
   * The url for the image of an age rating
   * @format url
   */
  rating_cover_url?: string;
  /** A free text motivating a rating */
  synopsis?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The rating category from the organization */
export interface AgeRatingCategory {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The rating name */
  rating?: string;
  organization?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The organization that has issued a specific rating
 * 1: ESRB
 * 2: PEGI
 * 3: CERO
 * 4: USK
 * 5: GRAC
 * 6: CLASS_IND
 * 7: ACB
 * @deprecated
 * @format int32
 */
export enum AgeRatingCategoryEnums {
  ESRB = 1,
  PEGI = 2,
  CERO = 3,
  USK = 4,
  GRAC = 5,
  CLASS_IND = 6,
  ACB = 7,
}

/** Age Rating according to various rating organisations */
export interface AgeRatingOrganization {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The title of an age rating organization */
  name?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The age rating assigned by the organization
 * 1: Three
 * 2: Seven
 * 3: Twelve
 * 4: Sixteen
 * 5: Eighteen
 * 6: RP
 * 7: EC
 * 8: E
 * 9: E10
 * 10: T
 * 11: M
 * 12: AO
 * 13: CERO_A
 * 14: CERO_B
 * 15: CERO_C
 * 16: CERO_D
 * 17: CERO_Z
 * 18: USK_0
 * 19: USK_6
 * 20: USK_12
 * 21: USK_16
 * 22: USK_18
 * 23: GRAC_ALL
 * 24: GRAC_Twelve
 * 25: GRAC_Fifteen
 * 26: GRAC_Eighteen
 * 27: GRAC_TESTING
 * 28: CLASS_IND_L
 * 29: CLASS_IND_Ten
 * 30: CLASS_IND_Twelve
 * 31: CLASS_IND_Fourteen
 * 32: CLASS_IND_Sixteen
 * 33: CLASS_IND_Eighteen
 * 34: ACB_G
 * 35: ACB_PG
 * 36: ACB_M
 * 37: ACB_MA15
 * 38: ACB_R18
 * 39: ACB_RC
 * @deprecated
 * @format int32
 */
export enum AgeRatingEnums {
  Three = 1,
  Seven = 2,
  Twelve = 3,
  Sixteen = 4,
  Eighteen = 5,
  RP = 6,
  EC = 7,
  E = 8,
  E10 = 9,
  T = 10,
  M = 11,
  AO = 12,
  CERO_A = 13,
  CERO_B = 14,
  CERO_C = 15,
  CERO_D = 16,
  CERO_Z = 17,
  USK0 = 18,
  USK6 = 19,
  USK12 = 20,
  USK16 = 21,
  USK18 = 22,
  GRAC_ALL = 23,
  GRACTwelve = 24,
  GRACFifteen = 25,
  GRACEighteen = 26,
  GRAC_TESTING = 27,
  CLASS_IND_L = 28,
  CLASSINDTen = 29,
  CLASSINDTwelve = 30,
  CLASSINDFourteen = 31,
  CLASSINDSixteen = 32,
  CLASSINDEighteen = 33,
  ACB_G = 34,
  ACB_PG = 35,
  ACB_M = 36,
  ACBMA15 = 37,
  ACBR18 = 38,
  ACB_RC = 39,
}

/** @deprecated */
export interface AgeRatingContentDescription {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * The age rating content description enums
   * 1: ESRB_alcohol_reference
   * 2: ESRB_animated_blood
   * 3: ESRB_blood
   * 4: ESRB_blood_and gore
   * 5: ESRB_cartoon_violence
   * 6: ESRB_comic_mischief
   * 7: ESRB_crude_humor
   * 8: ESRB_drug_reference
   * 9: ESRB_fantasy_violence
   * 10: ESRB_intense_violence
   * 11: ESRB_language
   * 12: ESRB_lyrics
   * 13: ESRB_mature_humor
   * 14: ESRB_nudity
   * 15: ESRB_partial_nudity
   * 16: ESRB_real_gambling
   * 17: ESRB_sexual_content
   * 18: ESRB_sexual_themes
   * 19: ESRB_sexual_violence
   * 20: ESRB_simulated_gambling
   * 21: ESRB_strong_language
   * 22: ESRB_strong_lyrics
   * 23: ESRB_strong_sexual content
   * 24: ESRB_suggestive_themes
   * 25: ESRB_tobacco_reference
   * 26: ESRB_use_of alcohol
   * 27: ESRB_use_of drugs
   * 28: ESRB_use_of tobacco
   * 29: ESRB_violence
   * 30: ESRB_violent_references
   * 31: ESRB_animated_violence
   * 32: ESRB_mild_language
   * 33: ESRB_mild_violence
   * 34: ESRB_use_of drugs and alcohol
   * 35: ESRB_drug_and alcohol reference
   * 36: ESRB_mild_suggestive themes
   * 37: ESRB_mild_cartoon violence
   * 38: ESRB_mild_blood
   * 39: ESRB_realistic_blood and gore
   * 40: ESRB_realistic_violence
   * 41: ESRB_alcohol_and tobacco reference
   * 42: ESRB_mature_sexual themes
   * 43: ESRB_mild_animated violence
   * 44: ESRB_mild_sexual themes
   * 45: ESRB_use_of alcohol and tobacco
   * 46: ESRB_animated_blood and gore
   * 47: ESRB_mild_fantasy violence
   * 48: ESRB_mild_lyrics
   * 49: ESRB_realistic_blood
   * 50: PEGI_violence
   * 51: PEGI_sex
   * 52: PEGI_drugs
   * 53: PEGI_fear
   * 54: PEGI_discrimination
   * 55: PEGI_bad_language
   * 56: PEGI_gambling
   * 57: PEGI_online_gameplay
   * 58: PEGI_in_game_purchases
   * 59: CERO_love
   * 60: CERO_sexual_content
   * 61: CERO_violence
   * 62: CERO_horror
   * 63: CERO_drinking_smoking
   * 64: CERO_gambling
   * 65: CERO_crime
   * 66: CERO_controlled_substances
   * 67: CERO_languages_and others
   * 68: GRAC_sexuality
   * 69: GRAC_violence
   * 70: GRAC_fear_horror_threatening
   * 71: GRAC_language
   * 72: GRAC_alcohol_tobacco_drug
   * 73: GRAC_crime_anti_social
   * 74: GRAC_gambling
   * 75: CLASS_IND_violencia
   * 76: CLASS_IND_violencia_extrema
   * 77: CLASS_IND_conteudo_sexual
   * 78: CLASS_IND_nudez
   * 79: CLASS_IND_sexo
   * 80: CLASS_IND_sexo_explicito
   * 81: CLASS_IND_drogas
   * 82: CLASS_IND_drogas_licitas
   * 83: CLASS_IND_drogas_ilicitas
   * 84: CLASS_IND_linguagem_impropria
   * 85: CLASS_IND_atos_criminosos
   */
  category?: AgeRatingContentDescriptionCategoryEnums;
  /** A string containing the age rating content descriptions */
  description?: string;
  /** Hash of the object */
  checksum?: string;
}

export interface AgeRatingContentDescriptionV2 {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  organization?: any;
  /** A string containing the age rating content descriptions */
  description?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: any;
}

/**
 * The age rating content description enums
 * 1: ESRB_alcohol_reference
 * 2: ESRB_animated_blood
 * 3: ESRB_blood
 * 4: ESRB_blood_and gore
 * 5: ESRB_cartoon_violence
 * 6: ESRB_comic_mischief
 * 7: ESRB_crude_humor
 * 8: ESRB_drug_reference
 * 9: ESRB_fantasy_violence
 * 10: ESRB_intense_violence
 * 11: ESRB_language
 * 12: ESRB_lyrics
 * 13: ESRB_mature_humor
 * 14: ESRB_nudity
 * 15: ESRB_partial_nudity
 * 16: ESRB_real_gambling
 * 17: ESRB_sexual_content
 * 18: ESRB_sexual_themes
 * 19: ESRB_sexual_violence
 * 20: ESRB_simulated_gambling
 * 21: ESRB_strong_language
 * 22: ESRB_strong_lyrics
 * 23: ESRB_strong_sexual content
 * 24: ESRB_suggestive_themes
 * 25: ESRB_tobacco_reference
 * 26: ESRB_use_of alcohol
 * 27: ESRB_use_of drugs
 * 28: ESRB_use_of tobacco
 * 29: ESRB_violence
 * 30: ESRB_violent_references
 * 31: ESRB_animated_violence
 * 32: ESRB_mild_language
 * 33: ESRB_mild_violence
 * 34: ESRB_use_of drugs and alcohol
 * 35: ESRB_drug_and alcohol reference
 * 36: ESRB_mild_suggestive themes
 * 37: ESRB_mild_cartoon violence
 * 38: ESRB_mild_blood
 * 39: ESRB_realistic_blood and gore
 * 40: ESRB_realistic_violence
 * 41: ESRB_alcohol_and tobacco reference
 * 42: ESRB_mature_sexual themes
 * 43: ESRB_mild_animated violence
 * 44: ESRB_mild_sexual themes
 * 45: ESRB_use_of alcohol and tobacco
 * 46: ESRB_animated_blood and gore
 * 47: ESRB_mild_fantasy violence
 * 48: ESRB_mild_lyrics
 * 49: ESRB_realistic_blood
 * 50: PEGI_violence
 * 51: PEGI_sex
 * 52: PEGI_drugs
 * 53: PEGI_fear
 * 54: PEGI_discrimination
 * 55: PEGI_bad_language
 * 56: PEGI_gambling
 * 57: PEGI_online_gameplay
 * 58: PEGI_in_game_purchases
 * 59: CERO_love
 * 60: CERO_sexual_content
 * 61: CERO_violence
 * 62: CERO_horror
 * 63: CERO_drinking_smoking
 * 64: CERO_gambling
 * 65: CERO_crime
 * 66: CERO_controlled_substances
 * 67: CERO_languages_and others
 * 68: GRAC_sexuality
 * 69: GRAC_violence
 * 70: GRAC_fear_horror_threatening
 * 71: GRAC_language
 * 72: GRAC_alcohol_tobacco_drug
 * 73: GRAC_crime_anti_social
 * 74: GRAC_gambling
 * 75: CLASS_IND_violencia
 * 76: CLASS_IND_violencia_extrema
 * 77: CLASS_IND_conteudo_sexual
 * 78: CLASS_IND_nudez
 * 79: CLASS_IND_sexo
 * 80: CLASS_IND_sexo_explicito
 * 81: CLASS_IND_drogas
 * 82: CLASS_IND_drogas_licitas
 * 83: CLASS_IND_drogas_ilicitas
 * 84: CLASS_IND_linguagem_impropria
 * 85: CLASS_IND_atos_criminosos
 * @deprecated
 * @format int32
 */
export enum AgeRatingContentDescriptionCategoryEnums {
  ESRBAlcoholReference = 1,
  ESRBAnimatedBlood = 2,
  ESRBBlood = 3,
  ESRBBloodAndGore = 4,
  ESRBCartoonViolence = 5,
  ESRBComicMischief = 6,
  ESRBCrudeHumor = 7,
  ESRBDrugReference = 8,
  ESRBFantasyViolence = 9,
  ESRBIntenseViolence = 10,
  ESRBLanguage = 11,
  ESRBLyrics = 12,
  ESRBMatureHumor = 13,
  ESRBNudity = 14,
  ESRBPartialNudity = 15,
  ESRBRealGambling = 16,
  ESRBSexualContent = 17,
  ESRBSexualThemes = 18,
  ESRBSexualViolence = 19,
  ESRBSimulatedGambling = 20,
  ESRBStrongLanguage = 21,
  ESRBStrongLyrics = 22,
  ESRBStrongSexualContent = 23,
  ESRBSuggestiveThemes = 24,
  ESRBTobaccoReference = 25,
  ESRBUseOfAlcohol = 26,
  ESRBUseOfDrugs = 27,
  ESRBUseOfTobacco = 28,
  ESRBViolence = 29,
  ESRBViolentReferences = 30,
  ESRBAnimatedViolence = 31,
  ESRBMildLanguage = 32,
  ESRBMildViolence = 33,
  ESRBUseOfDrugsAndAlcohol = 34,
  ESRBDrugAndAlcoholReference = 35,
  ESRBMildSuggestiveThemes = 36,
  ESRBMildCartoonViolence = 37,
  ESRBMildBlood = 38,
  ESRBRealisticBloodAndGore = 39,
  ESRBRealisticViolence = 40,
  ESRBAlcoholAndTobaccoReference = 41,
  ESRBMatureSexualThemes = 42,
  ESRBMildAnimatedViolence = 43,
  ESRBMildSexualThemes = 44,
  ESRBUseOfAlcoholAndTobacco = 45,
  ESRBAnimatedBloodAndGore = 46,
  ESRBMildFantasyViolence = 47,
  ESRBMildLyrics = 48,
  ESRBRealisticBlood = 49,
  PEGIViolence = 50,
  PEGISex = 51,
  PEGIDrugs = 52,
  PEGIFear = 53,
  PEGIDiscrimination = 54,
  PEGIBadLanguage = 55,
  PEGIGambling = 56,
  PEGIOnlineGameplay = 57,
  PEGIInGamePurchases = 58,
  CEROLove = 59,
  CEROSexualContent = 60,
  CEROViolence = 61,
  CEROHorror = 62,
  CERODrinkingSmoking = 63,
  CEROGambling = 64,
  CEROCrime = 65,
  CEROControlledSubstances = 66,
  CEROLanguagesAndOthers = 67,
  GRACSexuality = 68,
  GRACViolence = 69,
  GRACFearHorrorThreatening = 70,
  GRACLanguage = 71,
  GRACAlcoholTobaccoDrug = 72,
  GRACCrimeAntiSocial = 73,
  GRACGambling = 74,
  CLASSINDViolencia = 75,
  CLASSINDViolenciaExtrema = 76,
  CLASSINDConteudoSexual = 77,
  CLASSINDNudez = 78,
  CLASSINDSexo = 79,
  CLASSINDSexoExplicito = 80,
  CLASSINDDrogas = 81,
  CLASSINDDrogasLicitas = 82,
  CLASSINDDrogasIlicitas = 83,
  CLASSINDLinguagemImpropria = 84,
  CLASSINDAtosCriminosos = 85,
}

/** Alternative and international game titles */
export interface AlternativeNames {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** A description of what kind of alternative name it is. (Acronym, Working title, Japanese title etc) */
  comment?: string;
  game?: any;
  /** An alternative name */
  name?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Official artworks. Resolution and aspect ratio may vary */
export interface Artwork {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  game?: any;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Video game characters */
export interface Character {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** Alternative names for a character */
  akas?: string[];
  /** A Character's country of origin */
  country_name?: string;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** Text describing a character */
  description?: string;
  games?: any[];
  /**
   * An Enum of the character's gender
   * 0: Male
   * 1: Female
   * 2: Other
   */
  gender?: CharacterGenderEnum;
  character_gender?: any;
  mug_shot?: any;
  /** The character's name */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * An enum of the Character's species
   * 1: Human
   * 2: Alien
   * 3: Animal
   */
  species?: CharacterSpeciesEnum;
  character_species?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Character Genders */
export interface CharacterGender {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The gender */
  name?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Character Species */
export interface CharacterSpecies {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The species */
  name?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * An Enum of the character's gender
 * 0: Male
 * 1: Female
 * 2: Other
 * @deprecated
 * @format int32
 */
export enum CharacterGenderEnum {
  Male = 0,
  Female = 1,
  Other = 2,
}

/**
 * An enum of the Character's species
 * 1: Human
 * 2: Alien
 * 3: Animal
 * @deprecated
 * @format int32
 */
export enum CharacterSpeciesEnum {
  Human = 1,
  Alien = 2,
  Animal = 3,
}

/** Images depicting game characters */
export interface CharacterMugShot {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Collection, AKA Series */
export interface Collection {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  as_child_relations?: any[];
  as_parent_relations?: any[];
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  games?: any[];
  /** Umbrella term for a collection of games */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  type?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The collection memberships */
export interface CollectionMembership {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game?: any;
  /** Reference ID for Collection */
  collection?: string;
  type?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Enums for collection membership type */
export interface CollectionMembershipType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  allowed_collection_type?: any;
  /** Hash of the object */
  checksum?: string;
  /** Date this was initally added to the IGDB database */
  created_at?: number;
  /** Description of the membership type */
  description?: string;
  /** The membership type name */
  name?: string;
  /** The last date this entry was updated in the IGDB database */
  updated_at?: number;
}

/** Describes relationship between collections */
export interface CollectionRelation {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  child_collection?: any;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  parent_collection?: any;
  type?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Enums for collection membership type */
export interface CollectionRelationType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The membership type name */
  name?: string;
  /** Description of the membership type */
  description?: string;
  allowed_child_type?: any;
  allowed_parent_type?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Enums for collection membership type */
export interface CollectionType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The membership type name */
  name?: string;
  /** Description of the membership type */
  description?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Video game companies, both publishers and developers */
export interface Company {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * An enum of the date format
   * 0: YYYYMMMMDD
   * 1: YYYYMMMM
   * 2: YYYY
   * 3: YYYYQ1
   * 4: YYYYQ2
   * 5: YYYYQ3
   * 6: YYYYQ4
   * 7: TBD
   */
  change_date_category?: ChangeDateCategoryEnum;
  change_date_format?: any;
  /**
   * The date when a compnay got a new ID
   * @format timestamp
   */
  change_date?: number;
  /** The new ID for a company that has gone through a merger or restructuring */
  changed_company_id?: string;
  /**
   * ISO 3166-1 numeric country code
   * @format int32
   */
  country?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** A free text description of the company */
  description?: string;
  developed?: any[];
  logo?: any;
  /** The name of the company */
  name?: string;
  parent?: any;
  published?: any[];
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The date that the company was founded
   * @format timestamp
   */
  start_date?: number;
  /**
   * An enum of the date format
   * 0: YYYYMMMMDD
   * 1: YYYYMMMM
   * 2: YYYY
   * 3: YYYYQ1
   * 4: YYYYQ2
   * 5: YYYYQ3
   * 6: YYYYQ4
   * 7: TBD
   */
  start_date_category?: StartDateCategoryEnum;
  start_date_format?: any;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  websites?: any[];
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * An enum of the date format
 * 0: YYYYMMMMDD
 * 1: YYYYMMMM
 * 2: YYYY
 * 3: YYYYQ1
 * 4: YYYYQ2
 * 5: YYYYQ3
 * 6: YYYYQ4
 * 7: TBD
 * @deprecated
 * @format int32
 */
export enum ChangeDateCategoryEnum {
  YYYYMMMMDD = 0,
  YYYYMMMM = 1,
  YYYY = 2,
  YYYYQ1 = 3,
  YYYYQ2 = 4,
  YYYYQ3 = 5,
  YYYYQ4 = 6,
  TBD = 7,
}

/**
 * An enum of the date format
 * 0: YYYYMMMMDD
 * 1: YYYYMMMM
 * 2: YYYY
 * 3: YYYYQ1
 * 4: YYYYQ2
 * 5: YYYYQ3
 * 6: YYYYQ4
 * 7: TBD
 * @deprecated
 * @format int32
 */
export enum StartDateCategoryEnum {
  YYYYMMMMDD = 0,
  YYYYMMMM = 1,
  YYYY = 2,
  YYYYQ1 = 3,
  YYYYQ2 = 4,
  YYYYQ3 = 5,
  YYYYQ4 = 6,
  TBD = 7,
}

/** The logos of developers and publishers */
export interface CompanyLogo {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A company's website links */
export interface CompanyWebsite {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * An enum of the date format
   * 1: official
   * 2: wikia
   * 3: wikipedia
   * 4: facebook
   * 5: twitter
   * 6: twitch
   * 8: instagram
   * 9: youtube
   * 10: iphone
   * 11: ipad
   * 12: android
   * 13: steam
   * 14: reddit
   * 15: itch
   * 16: epicgames
   * 17: gog
   * 18: discord
   */
  category?: CompanyWebsiteEnums;
  type?: any;
  trusted?: boolean;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * An enum of the date format
 * 1: official
 * 2: wikia
 * 3: wikipedia
 * 4: facebook
 * 5: twitter
 * 6: twitch
 * 8: instagram
 * 9: youtube
 * 10: iphone
 * 11: ipad
 * 12: android
 * 13: steam
 * 14: reddit
 * 15: itch
 * 16: epicgames
 * 17: gog
 * 18: discord
 * @deprecated
 * @format int32
 */
export enum CompanyWebsiteEnums {
  Official = 1,
  Wikia = 2,
  Wikipedia = 3,
  Facebook = 4,
  Twitter = 5,
  Twitch = 6,
  Instagram = 8,
  Youtube = 9,
  Iphone = 10,
  Ipad = 11,
  Android = 12,
  Steam = 13,
  Reddit = 14,
  Itch = 15,
  Epicgames = 16,
  Gog = 17,
  Discord = 18,
}

/** The cover art of games */
export interface Cover {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  /** The game this cover is associated with. If it is empty then this cover belongs to a game_localization, which can be found under game_localization field */
  game?: any;
  /** Reference ID for Game Localization this cover might be associated with */
  game_localization?: string;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The date format */
export interface DateFormat {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The date format */
  format?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Gaming events like GamesCom, Tokyo Game Show, PAX, or GSL */
export interface Event {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the event */
  name?: string;
  /** The description of the event */
  description?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  event_logo?: any;
  /**
   * Start time of the event in UTC
   * @format timestamp
   */
  start_time?: number;
  /**
   * End time of the event in UTC
   * @format timestamp
   */
  end_time?: number;
  /** Timezone the event is in. */
  time_zone?: string;
  /**
   * URL to the livestream of the event.
   * @format url
   */
  live_stream_url?: string;
  games?: any[];
  videos?: any[];
  event_networks?: any[];
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Logo for the event */
export interface EventLogo {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  event?: any;
  alpha_channel?: boolean;
  animated?: boolean;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** URLs related to the event like Twitter, Facebook, and Youtube */
export interface EventNetwork {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  event?: any;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  network_type?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A list of video game franchises such as Star Wars */
export interface Franchise {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  games?: any[];
  /** The name of the franchise */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Video Games! */
export interface Games {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  age_ratings?: AgeRatingEnums[];
  /**
   * Rating based on external critic scores
   * @format double
   */
  aggregated_rating?: number;
  /**
   * Number of external critic scores
   * @format int32
   */
  aggregated_rating_count?: number;
  alternative_names?: any[];
  artworks?: any[];
  bundles?: any[];
  /**
   * A game's category/catagories
   * 0: main_game
   * 1: dlc_addon
   * 2: expansion
   * 3: bundle
   * 4: standalone_expansion
   * 5: mod
   * 6: episode
   * 7: season
   * 8: remake
   * 9: remaster
   * 10: expanded_game
   * 11: port
   * 12: fork
   * 13: pack
   * 14: update
   */
  category?: GameCategoryEnums;
  game_type?: any;
  collections?: any[];
  cover?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  dlcs?: any[];
  expanded_games?: any[];
  expansions?: any[];
  external_games?: any[];
  /**
   * The first release date for this game
   * @format timestamp
   */
  first_release_date?: number;
  forks?: any[];
  /** The main franchise */
  franchise?: string;
  /** Other franchises the game belongs to */
  franchises?: any[];
  /** The game engine used in this game */
  game_engines?: any[];
  /** Supported game localizations for this game. A region can have at most one game localization for a given game */
  game_localizations?: any[];
  /** Modes of gameplay */
  game_modes?: any[];
  /** Genres of the game */
  genres?: any[];
  /**
   * Number of follows a game gets before release
   * @format int32
   */
  hypes?: number;
  /** Companies who developed this game */
  involved_companies?: any[];
  /** Associated keywords */
  keywords?: any[];
  /** Supported Languages for this game */
  language_supports?: any[];
  /** Multiplayer modes for this game */
  multiplayer_modes?: any[];
  /** The name of the Game */
  name?: string;
  /** If a DLC, expansion or part of a bundle, this is the main game or bundle */
  parent_game?: any;
  /** Platforms this game was released on */
  platforms?: any[];
  /** The main perspective of the player */
  player_perspectives?: any[];
  /** Ports of this game */
  ports?: any[];
  /**
   * Average IGDB user rating
   * @format double
   */
  rating?: number;
  /**
   * Total number of IGDB user ratings
   * @format int32
   */
  rating_count?: number;
  /** Release dates of this game */
  release_dates?: any[];
  /** Remakes of this game */
  remakes?: any[];
  /** Remasters of this game */
  remasters?: any[];
  /** Screenshots of this game */
  screenshots?: any[];
  /** Similar games */
  similar_games?: any[];
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /** Standalone expansions of this game */
  standalone_expansions?: any[];
  /**
   * A game's operational status
   * 0: released
   * 2: alpha
   * 3: beta
   * 4: early_access
   * 5: offline
   * 6: cancelled
   * 7: rumored
   * 8: delisted
   */
  status?: GameStatusEnums;
  game_status?: any;
  /** A short description of a games story */
  storyline?: string;
  /** A description of the game */
  summary?: string;
  /** Related entities in the IGDB API */
  tags?: number[];
  /** Themes of the game */
  themes?: any[];
  /**
   * Average rating based on both IGDB user and external critic scores
   * @format double
   */
  total_rating?: number;
  /**
   * Total number of user and external critic scores
   * @format int32
   */
  total_rating_count?: number;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /** If a version, this is the main game */
  version_parent?: any[];
  /** Title of this version (i.e Gold edition) */
  version_title?: string;
  /** Videos of this game */
  videos?: any[];
  /** Websites associated with this game */
  websites?: any[];
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The release status of the game */
export interface GameStatus {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The release status of the game */
  status?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The format/medium of the game release */
export interface GameReleaseFormat {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The format/medium of the game release */
  format?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * A game's category/catagories
 * 0: main_game
 * 1: dlc_addon
 * 2: expansion
 * 3: bundle
 * 4: standalone_expansion
 * 5: mod
 * 6: episode
 * 7: season
 * 8: remake
 * 9: remaster
 * 10: expanded_game
 * 11: port
 * 12: fork
 * 13: pack
 * 14: update
 * @deprecated
 * @format int32
 */
export enum GameCategoryEnums {
  MainGame = 0,
  DlcAddon = 1,
  Expansion = 2,
  Bundle = 3,
  StandaloneExpansion = 4,
  Mod = 5,
  Episode = 6,
  Season = 7,
  Remake = 8,
  Remaster = 9,
  ExpandedGame = 10,
  Port = 11,
  Fork = 12,
  Pack = 13,
  Update = 14,
}

/**
 * A game's operational status
 * 0: released
 * 2: alpha
 * 3: beta
 * 4: early_access
 * 5: offline
 * 6: cancelled
 * 7: rumored
 * 8: delisted
 * @deprecated
 * @format int32
 */
export enum GameStatusEnums {
  Released = 0,
  Alpha = 2,
  Beta = 3,
  EarlyAccess = 4,
  Offline = 5,
  Cancelled = 6,
  Rumored = 7,
  Delisted = 8,
}

/** The type that this game is */
export interface GameType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The type that this game is */
  type?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Video game engines such as unreal engine */
export interface GameEngine {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  companies?: any[];
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** Description of the game engine */
  description?: string;
  /** Logo of the game engine */
  logo?: any;
  /** Name of the game engine */
  name?: string;
  /** Platforms this game engine was deployed on */
  platforms?: any[];
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The logos of developers and publishers */
export interface GameEngineLogo {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Game IDs on other services */
export interface ExternalGame {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The id of the other service */
  category?: ExternalGameCategoryEnums;
  external_game_source?: any;
  /** The ISO country code of the external game product. */
  countries?: number[];
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  game?: any;
  /** The media of the external game. */
  media?: ExternalGameMediaEnums;
  game_release_format?: any;
  /** The name of the game according to the other service */
  name?: string;
  /** The platform of the external game product. */
  platform?: any;
  /** The other services ID for this game */
  uid?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The year in full (2018)
   * @format int32
   */
  year?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Sources for the external games */
export interface ExternalGameSource {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The game source */
  name?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The external platform the game is on
 * 1: steam
 * 5: gog
 * 10: youtube
 * 11: microsoft
 * 13: apple
 * 14: twitch
 * 15: android
 * 20: amazon_asin
 * 22: amazon_luna
 * 23: amazon_adg
 * 26: epic_game_store
 * 28: oculus
 * 29: utomik
 * 30: itch_io
 * 31: xbox_marketplace
 * 32: kartridge
 * 36: playstation_store_us
 * 37: focus_entertainment
 * 54: xbox_game_pass_ultimate_cloud
 * 55: gamejolt
 * @deprecated
 * @format int32
 */
export enum ExternalGameCategoryEnums {
  Steam = 1,
  Gog = 5,
  Youtube = 10,
  Microsoft = 11,
  Apple = 13,
  Twitch = 14,
  Android = 15,
  AmazonAsin = 20,
  AmazonLuna = 22,
  AmazonAdg = 23,
  EpicGameStore = 26,
  Oculus = 28,
  Utomik = 29,
  ItchIo = 30,
  XboxMarketplace = 31,
  Kartridge = 32,
  PlaystationStoreUs = 36,
  FocusEntertainment = 37,
  XboxGamePassUltimateCloud = 54,
  Gamejolt = 55,
}

/**
 * The type of media
 * 1: digital
 * 2: physical
 * @deprecated
 * @format int32
 */
export enum ExternalGameMediaEnums {
  Digital = 1,
  Physical = 2,
}

/** Details about game editions and versions. (DLC and more) */
export interface GameVersion {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** Features and descriptions of what makes each version/edition different from the main game */
  features?: any[];
  /** The game these versions/editions are of */
  game?: any;
  /** Game Versions and Editions */
  games?: any[];
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Single player, Multiplayer, etc. */
export interface GameMode {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** The name of the game mode */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Average time to beat times for a game. */
export interface GameTimeToBeat {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game_id?: any;
  /**
   * Average time (in seconds) to finish the game to its credits without spending notable time on extras such as side quests.
   * @format int32
   */
  hastily?: number;
  /**
   * Average time (in seconds) to finish the game while mixing in some extras such as side quests without being overly thorough.
   * @format int32
   */
  normally?: number;
  /**
   * Average time (in seconds) to finish the game to 100% completion.
   * @format int32
   */
  completely?: number;
  /**
   * Total number of time to beat submissions for this game
   * @format int32
   */
  count?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Features and descriptions of what makes each version/edition different from the main game */
export interface GameVersionFeatures {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The category of the feature description */
  category?: GameVersionFeatureCategoryEnums;
  /** The description of the feature */
  description?: string;
  /**
   * Position of this feature in the list of features
   * @format int32
   */
  position?: number;
  /** The title of the version/addition/DLC */
  title?: string;
  /** The bool/text value of the feature */
  values?: any[];
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The data type of feature description
 * 0: boolean
 * 1: description
 * @format int32
 */
export enum GameVersionFeatureCategoryEnums {
  Boolean = 0,
  Description = 1,
}

/** The bool/text value of the feature */
export interface GameVersionFeatureValue {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game?: any;
  game_feature?: any;
  /**
   * The value of this feature
   * 0: NOT_INCLUDED
   * 1: INCLUDED
   * 2: PRE_ORDER_ONLY
   */
  included_feature?: GameVersionIncludedFeatureEnums;
  /** The text value of this feature */
  note?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The value of this feature
 * 0: NOT_INCLUDED
 * 1: INCLUDED
 * 2: PRE_ORDER_ONLY
 * @format int32
 */
export enum GameVersionIncludedFeatureEnums {
  NotIncluded = 0,
  Included = 1,
  PreOrderOnly = 2,
}

/** Genres of video games */
export interface Genre {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** The name of the genre */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Involved companies */
export interface InvolvedCompany {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  company?: any;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** Is the company a/the developer? */
  developer?: boolean;
  game?: any;
  /** Did the company port the game? */
  porting?: boolean;
  /** Did the company publish the game? */
  publisher?: boolean;
  /** Did the company suppport the game? */
  supporting?: boolean;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A video associated with a game */
export interface GameVideo {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game?: any;
  /** The name of the video */
  name?: string;
  /** The external ID of the video (usually youtube) */
  video_id?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Keywords are words or phrases that get tagged to a game such as “world war 2” or “steampunk”. */
export interface Keyword {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** The keyword */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Languages that are used in the Language Support endpoint. */
export interface Language {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the localization */
  name?: string;
  /** The native name of the language */
  native_name?: string;
  /** The combination of Language code and Country code (en-US) */
  locale?: string;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Game localization for a game */
export interface GameLocalization {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The localized name */
  name?: string;
  game?: any;
  /** Date this was initially added to the IGDB database */
  cover?: any;
  /** The region ID */
  region?: any;
  /** @format timestamp */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Language Support Types contains the identifiers for the support types that Language Support uses. */
export interface LanguageSupportType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the method of support. (Audio, Subtitles, etc) */
  name?: string;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Data about the supported multiplayer types */
export interface MultiplayerMode {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** True if the game supports campaign coop */
  camapigncoop?: boolean;
  /** True if the game supports drop in/out multiplayer */
  dropin?: boolean;
  game?: any;
  /** True if the game supports LAN coop */
  lancoop?: boolean;
  /** True if the game supports offline coop */
  offlinecoop?: number;
  /**
   * Maximum number of offline players in offline coop
   * @format int32
   */
  offliencoopmax?: number;
  /**
   * Maximum number of players in offline multiplayer
   * @format int32
   */
  offlinemax?: number;
  /** True if the game supports online coop */
  onlinecoop?: boolean;
  /**
   * Maximum number of online players in online coop
   * @format int32
   */
  onlinecoopmax?: number;
  /**
   * Maximum number of online players in online coop
   * @format int32
   */
  onlinemax?: number;
  platform?: any;
  /** True if the game supports, split screen, offline multiplayer */
  splitscreen?: boolean;
  /** True if the game supports split screen, online multiplayer */
  splitscreenonline?: boolean;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Games can be played with different languages for voice acting, subtitles, or the interface language. */
export interface LanguageSupport {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game?: any;
  language?: any;
  language_support_type?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Social networks related to the event like twitter, facebook and youtube */
export interface NetworkType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the social network */
  name?: string;
  event_networks?: any[];
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A collection of closely related platforms */
export interface PlatformFamily {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the platform family */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** TThe hardware used to run the game or game delivery network */
export interface PlatformType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The hardware used to run the game or game delivery network */
  name?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Logo for a platform */
export interface PlatformLogo {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The specific platform and the specifications (Xbox Series X, Playstation 5) */
export interface PlatformVersion {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  companies?: any[];
  /** The network capabilities */
  connectivity?: string;
  /** The integrated central processing unit */
  cpu?: string;
  /** The graphics chipset */
  graphics?: string;
  main_manufacturer?: any;
  /** The type of media this version accepts */
  media?: string;
  /** How much memory there is */
  memory?: string;
  /** The name of the platform version */
  name?: string;
  /** The online service, like Xbox Live */
  online?: string;
  /** The operating system installed on the platform version */
  os?: string;
  /** The output video rate */
  output?: string;
  platform_logo?: any;
  platform_version_release_dates?: any[];
  /** The maximum resolution */
  resolutions?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /** The sound chipset */
  sound?: string;
  /** How much storage there is */
  storage?: string;
  /** A short summary */
  summary?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A platform developer */
export interface PlatformVersionCompany {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** Any notable comments about the developer */
  comment?: string;
  company?: any;
  /** If the company is the developer */
  developer?: boolean;
  /** If the company is the manufactuer */
  manufacturer?: boolean;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** The hardware used to run the game or game delivery network */
export interface Platform {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** An abbreviation of the platform name */
  abbreviation?: string;
  /** An alternative name for the platform */
  alternative_name?: string;
  /**
   * The category of the platform
   * 1: console
   * 2: arcade
   * 3: platform
   * 4: operating_system
   * 5: portable_console
   * 6: computer
   */
  category?: PlatformCategoryEnums;
  platform_type?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The generation of the platform
   * @format int32
   */
  generation?: number;
  /** The name of the platform */
  name?: string;
  platform_family?: any;
  platform_logo?: any;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /** The summary of the first Version of this platform */
  summary?: string;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  versions?: any[];
  websites?: any[];
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The category of the platform
 * 1: console
 * 2: arcade
 * 3: platform
 * 4: operating_system
 * 5: portable_console
 * 6: computer
 * @deprecated
 * @format int32
 */
export enum PlatformCategoryEnums {
  Console = 1,
  Arcade = 2,
  Platform = 3,
  OperatingSystem = 4,
  PortableConsole = 5,
  Computer = 6,
}

/** A handy endpoint that extends platform release dates. Used to dig deeper into release dates, platforms and versions. */
export interface PlatformVersionReleaseDate {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * An enum of the date format
   * 0: YYYYMMMMDD
   * 1: YYYYMMMM
   * 2: YYYY
   * 3: YYYYQ1
   * 4: YYYYQ2
   * 5: YYYYQ3
   * 6: YYYYQ4
   * 7: TBD
   */
  category?: PlatformVersionReleaseDateEnums;
  date_format?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The release date
   * @format timestamp
   */
  date?: string;
  /** A human readable version of the release date */
  human?: string;
  /**
   * The month as an integer starting at 1 (January)
   * @format int32
   */
  m?: number;
  platform_version?: any;
  /**
   * An enum of the region for the release date
   * 1: europe
   * 2: north_america
   * 3: australia
   * 4: new_zealand
   * 5: japan
   * 6: china
   * 7: asia
   * 8: worldwide
   * 9: korea
   * 10: brazil
   */
  region?: PlatformVersionReleaseDateRegionEnum;
  release_region?: any;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The year in full (2018)
   * @format int32
   */
  y?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * An enum of the date format
 * 0: YYYYMMMMDD
 * 1: YYYYMMMM
 * 2: YYYY
 * 3: YYYYQ1
 * 4: YYYYQ2
 * 5: YYYYQ3
 * 6: YYYYQ4
 * 7: TBD
 * @deprecated
 * @format int32
 */
export enum PlatformVersionReleaseDateEnums {
  YYYYMMMMDD = 0,
  YYYYMMMM = 1,
  YYYY = 2,
  YYYYQ1 = 3,
  YYYYQ2 = 4,
  YYYYQ3 = 5,
  YYYYQ4 = 6,
  TBD = 7,
}

/**
 * An enum of the region for the release date
 * 1: europe
 * 2: north_america
 * 3: australia
 * 4: new_zealand
 * 5: japan
 * 6: china
 * 7: asia
 * 8: worldwide
 * 9: korea
 * 10: brazil
 * @deprecated
 * @format int32
 */
export enum PlatformVersionReleaseDateRegionEnum {
  Europe = 1,
  NorthAmerica = 2,
  Australia = 3,
  NewZealand = 4,
  Japan = 5,
  China = 6,
  Asia = 7,
  Worldwide = 8,
  Korea = 9,
  Brazil = 10,
}

/** The main website for the platform */
export interface PlatformWebsite {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * The platform website
   * 1: official
   * 2: wikia
   * 3: wikipedia
   * 4: facebook
   * 5: twitter
   * 6: twitch
   * 8: instagram
   * 9: youtube
   * 10: iphone
   * 11: ipad
   * 12: android
   * 13: steam
   * 14: reddit
   * 15: discord
   * 16: google_plus
   * 17: tumblr
   * 18: linkedin
   * 19: pinterest
   * 20: soundcloud
   */
  category?: PlatformWebsiteCategoryEnums;
  trusted?: boolean;
  /**
   * The main platform address (URL) of the platform
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The platform website
 * 1: official
 * 2: wikia
 * 3: wikipedia
 * 4: facebook
 * 5: twitter
 * 6: twitch
 * 8: instagram
 * 9: youtube
 * 10: iphone
 * 11: ipad
 * 12: android
 * 13: steam
 * 14: reddit
 * 15: discord
 * 16: google_plus
 * 17: tumblr
 * 18: linkedin
 * 19: pinterest
 * 20: soundcloud
 * @format int32
 */
export enum PlatformWebsiteCategoryEnums {
  Official = 1,
  Wikia = 2,
  Wikipedia = 3,
  Facebook = 4,
  Twitter = 5,
  Twitch = 6,
  Instagram = 8,
  Youtube = 9,
  Iphone = 10,
  Ipad = 11,
  Android = 12,
  Steam = 13,
  Reddit = 14,
  Discord = 15,
  GooglePlus = 16,
  Tumblr = 17,
  Linkedin = 18,
  Pinterest = 19,
  Soundcloud = 20,
}

/** Player perspectives describe the view/perspective of the player in a video game. */
export interface PlayerPerspective {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /** The perspective */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Lists abailable primatives with their source and popularity type */
export interface PopularityPrimative {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  game_id?: any;
  popularity_type?: any;
  /** 121: IGDB */
  popularity_source?: PopularityPrimitiveEnum;
  external_popularity_source?: any;
  /**
   * The rating value
   * @format int32
   */
  value?: number;
  /**
   * Timestamp of when the primatives were calculated
   * @format timestamp
   */
  calculated_at?: number;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
}

/**
 * 121: IGDB
 * @deprecated
 * @format int32
 */
export enum PopularityPrimitiveEnum {
  Igdb = 121,
}

/** Describes what type of popularity primative or popularity indicator the popularity indicator the popularity value is */
export interface PopularityType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** 121: IGDB */
  popularity_source?: PopularityTypeEnum;
  external_popularity_source?: any;
  /** The name of the type of popularity from the source */
  name?: string;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The IGDB object unique identifier
   * @format uuid
   */
  checksum?: string;
}

/**
 * 121: IGDB
 * @deprecated
 * @format int32
 */
export enum PopularityTypeEnum {
  Igdb = 121,
}

/** Region for game localization */
export interface Region {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the region */
  name?: string;
  /**
   * Whether the region is a local or continent
   * @format string
   */
  category?: "locale" | "continent";
  /**
   * This is the identifier of each region
   * @format string
   */
  identifier?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A handy endpoint that extends platform release dates. Used to dig deeper into release dates, platforms and versions. */
export interface ReleaseDate {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * An enum of the date format
   * 0: YYYYMMMMDD
   * 1: YYYYMMMM
   * 2: YYYY
   * 3: YYYYQ1
   * 4: YYYYQ2
   * 5: YYYYQ3
   * 6: YYYYQ4
   * 7: TBD
   */
  category?: ReleaseDateCategoryEnums;
  date_format?: any;
  /**
   * Date this was initially added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * The release date
   * @format timestamp
   */
  date?: string;
  game?: any;
  /** A human readable version of the release date */
  human?: string;
  /**
   * The month as an integer starting at 1 (January)
   * @format int32
   */
  m?: number;
  platform?: any;
  /**
   * An enum of the region for the release date
   * 1: europe
   * 2: north_america
   * 3: australia
   * 4: new_zealand
   * 5: japan
   * 6: china
   * 7: asia
   * 8: worldwide
   * 9: korea
   * 10: brazil
   */
  region?: ReleaseDateRegionEnum;
  release_region?: any;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The year in full (2018)
   * @format int32
   */
  y?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * An enum of the date format
 * 0: YYYYMMMMDD
 * 1: YYYYMMMM
 * 2: YYYY
 * 3: YYYYQ1
 * 4: YYYYQ2
 * 5: YYYYQ3
 * 6: YYYYQ4
 * 7: TBD
 * @deprecated
 * @format int32
 */
export enum ReleaseDateCategoryEnums {
  YYYYMMMMDD = 0,
  YYYYMMMM = 1,
  YYYY = 2,
  YYYYQ1 = 3,
  YYYYQ2 = 4,
  YYYYQ3 = 5,
  YYYYQ4 = 6,
  TBD = 7,
}

/**
 * An enum of the region for the release date
 * 1: europe
 * 2: north_america
 * 3: australia
 * 4: new_zealand
 * 5: japan
 * 6: china
 * 7: asia
 * 8: worldwide
 * 9: korea
 * 10: brazil
 * @deprecated
 * @format int32
 */
export enum ReleaseDateRegionEnum {
  Europe = 1,
  NorthAmerica = 2,
  Australia = 3,
  NewZealand = 4,
  Japan = 5,
  China = 6,
  Asia = 7,
  Worldwide = 8,
  Korea = 9,
  Brazil = 10,
}

/** An endpoint to provide definition of all of the current release date statuses. */
export interface ReleaseDateStatus {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the release date status */
  name?: string;
  /** The description of the release date status. */
  description?: string;
  /**
   * Date this was initially added to the IGDB database
   * @format date
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** An endpoint to provide definition of all of the current release date statuses. */
export interface ReleaseDateRegion {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** Regions for release dates */
  region?: string;
  /**
   * Date this was initially added to the IGDB database
   * @format date
   */
  created_at?: number;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Screenshots of games */
export interface Screenshot {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alpha_channel?: boolean;
  animated?: boolean;
  game?: any;
  /**
   * The height of the image in pixels
   * @format int32
   */
  height?: number;
  /** The ID of the image used to construct an IGDB image link */
  image_id?: string;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * The width of the image in pixels
   * @format int32
   */
  width?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Search IGDB and get the IDs of items matching your search */
export interface Search {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  alternative_name?: string;
  character?: any;
  collection?: any;
  company?: any;
  description?: string;
  game?: any;
  name?: string;
  platform?: any;
  /**
   * The date this item was initally published by the third party
   * @format timestamp
   */
  published_at?: number;
  /** Reference ID for Test Dummy */
  test_dummy?: number;
  theme?: any;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** Video game themes */
export interface Theme {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The name of the theme */
  name?: string;
  /** A url-safe, unique, lower-case version of the name */
  slug?: string;
  /**
   * Date this was last updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * The website address (URL) of the item
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A website URL, usually associated with a game */
export interface Website {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /**
   * The platform website
   * 1: official
   * 2: wikia
   * 3: wikipedia
   * 4: facebook
   * 5: twitter
   * 6: twitch
   * 8: instagram
   * 9: youtube
   * 10: iphone
   * 11: ipad
   * 12: android
   * 13: steam
   * 14: reddit
   * 15: itch
   * 16: epicgames
   * 17: gog
   * 18: discord
   */
  category?: WebsiteCategoryEnums;
  type?: any;
  game?: any;
  trusted?: boolean;
  /**
   * The main platform address (URL) of the platform
   * @format url
   */
  url?: string;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/** A website type, usually the name of the website */
export interface WebsiteType {
  /**
   * The IGDB object unique identifier
   * @format int32
   */
  id?: number;
  /** The website type */
  type?: string;
  /**
   * The last date this entry was updated in the IGDB database
   * @format timestamp
   */
  updated_at?: number;
  /**
   * Date this was initally added to the IGDB database
   * @format timestamp
   */
  created_at?: number;
  /**
   * Hash of the object
   * @format uuid
   */
  checksum?: string;
}

/**
 * The platform website
 * 1: official
 * 2: wikia
 * 3: wikipedia
 * 4: facebook
 * 5: twitter
 * 6: twitch
 * 8: instagram
 * 9: youtube
 * 10: iphone
 * 11: ipad
 * 12: android
 * 13: steam
 * 14: reddit
 * 15: itch
 * 16: epicgames
 * 17: gog
 * 18: discord
 * @deprecated
 * @format int32
 */
export enum WebsiteCategoryEnums {
  Official = 1,
  Wikia = 2,
  Wikipedia = 3,
  Facebook = 4,
  Twitter = 5,
  Twitch = 6,
  Instagram = 8,
  Youtube = 9,
  Iphone = 10,
  Ipad = 11,
  Android = 12,
  Steam = 13,
  Reddit = 14,
  Itch = 15,
  Epicgames = 16,
  Gog = 17,
  Discord = 18,
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.igdb.com/v4";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title IGDB API
 * @version 4.0.0
 * @license Twitch Developer Services Agreement (https://www.twitch.tv/p/legal/developer-agreement/)
 * @termsOfService https://www.twitch.tv/p/en/legal/terms-of-service/
 * @baseUrl https://api.igdb.com/v4
 * @externalDocs https://api-docs.igdb.com
 * @contact IGDB Support <support@igdb.com> (https://www.igdb.com/contact)
 *
 * This OpenAPI documentation and schema project IS IN BETA and maintained by [s-crypt.](https://github.com/s-crypt)
 *
 * The source code and more information is [available in the GitHub repository](https://github.com/s-crypt/IGDB-OpenAPI)
 *
 * Issues and pull requests are welcome! Please report any bugs or discrepancies you come across!
 */
export class IGDB_API<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  ageRatings = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAgeRating
     * @summary Age Rating according to various rating organizations
     * @request POST:/age_ratings
     * @secure
     */
    retrieveAgeRating: (data?: string, params: RequestParams = {}) =>
      this.request<
        AgeRating[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/age_ratings`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  ageRatingOrganizations = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAgeRatingOrganization
     * @summary Age Rating according to various rating organisations
     * @request POST:/age_rating_organizations
     * @secure
     */
    retrieveAgeRatingOrganization: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        AgeRatingOrganization[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/age_rating_organizations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  ageRatingCategories = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAgeRatingCategory
     * @summary The rating category from the organization
     * @request POST:/age_rating_categories
     * @secure
     */
    retrieveAgeRatingCategory: (data?: string, params: RequestParams = {}) =>
      this.request<
        AgeRatingCategory[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/age_rating_categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  ageRatingContentDescriptions = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAgeRatingContentDescription
     * @summary Age Rating Descriptors
     * @request POST:/age_rating_content_descriptions
     * @deprecated
     * @secure
     */
    retrieveAgeRatingContentDescription: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        AgeRatingContentDescription[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/age_rating_content_descriptions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  ageRatingContentDescriptionsV2 = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAgeRatingContentDescriptionv2
     * @summary Age Rating Descriptors
     * @request POST:/age_rating_content_descriptions_v2
     * @secure
     */
    retrieveAgeRatingContentDescriptionv2: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        AgeRatingContentDescriptionV2[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/age_rating_content_descriptions_v2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  alternativeNames = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetrieveAlternativeNames
     * @summary Alternative and international game titles
     * @request POST:/alternative_names
     * @secure
     */
    retrieveAlternativeNames: (data?: string, params: RequestParams = {}) =>
      this.request<
        AlternativeNames[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/alternative_names`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  artworks = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveArtwork
     * @summary Official artworks (resolution and aspect ratio may vary)
     * @request POST:/artworks
     * @secure
     */
    retreiveArtwork: (data?: string, params: RequestParams = {}) =>
      this.request<
        Artwork[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/artworks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  characters = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCharacter
     * @summary Video game characters
     * @request POST:/characters
     * @secure
     */
    retreiveCharacter: (data?: string, params: RequestParams = {}) =>
      this.request<
        Character[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/characters`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  characterGenders = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCharacterGenders
     * @summary Character Genders
     * @request POST:/character_genders
     * @secure
     */
    retreiveCharacterGenders: (data?: string, params: RequestParams = {}) =>
      this.request<
        CharacterGender[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/character_genders`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  characterSpecies = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCharacterSpecies
     * @summary Character Species
     * @request POST:/character_species
     * @secure
     */
    retreiveCharacterSpecies: (data?: string, params: RequestParams = {}) =>
      this.request<
        CharacterSpecies[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/character_species`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  characterMugShots = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCharacterMugShot
     * @summary Images depicting game characters
     * @request POST:/character_mug_shots
     * @secure
     */
    retreiveCharacterMugShot: (data?: string, params: RequestParams = {}) =>
      this.request<
        CharacterMugShot[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/character_mug_shots`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collections = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollection
     * @summary Collection, AKA Series
     * @request POST:/collections
     * @secure
     */
    retreiveCollection: (data?: string, params: RequestParams = {}) =>
      this.request<
        Collection[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collections`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collectionMemberships = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollectionMembership
     * @summary The Collection Memberships.
     * @request POST:/collection_memberships
     * @secure
     */
    retreiveCollectionMembership: (data?: string, params: RequestParams = {}) =>
      this.request<
        CollectionMembership[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collection_memberships`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collectionMembershipTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollectionMembershipType
     * @summary Enums for collection membership types.
     * @request POST:/collection_membership_types
     * @secure
     */
    retreiveCollectionMembershipType: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        CollectionMembershipType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collection_membership_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collectionRelations = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollectionRelation
     * @summary Describes Relationship between Collections.
     * @request POST:/collection_relations
     * @secure
     */
    retreiveCollectionRelation: (data?: string, params: RequestParams = {}) =>
      this.request<
        CollectionRelation[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collection_relations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collectionRelationTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollectionRelationType
     * @summary Collection Relation Types
     * @request POST:/collection_relation_types
     * @secure
     */
    retreiveCollectionRelationType: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        CollectionRelationType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collection_relation_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  collectionTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCollectionType
     * @summary Enums for collection types.
     * @request POST:/collection_types
     * @secure
     */
    retreiveCollectionType: (data?: string, params: RequestParams = {}) =>
      this.request<
        CollectionType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/collection_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  companies = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCompany
     * @summary Video game companies. Both publishers & developers
     * @request POST:/companies
     * @secure
     */
    retreiveCompany: (data?: string, params: RequestParams = {}) =>
      this.request<
        Company[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/companies`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  companyLogos = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCompanyLogo
     * @summary The logos of developers and publishers
     * @request POST:/company_logos
     * @secure
     */
    retreiveCompanyLogo: (data?: string, params: RequestParams = {}) =>
      this.request<
        CompanyLogo[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/company_logos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  companyWebsites = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCompanyWebsite
     * @summary Company Websites
     * @request POST:/company_websites
     * @secure
     */
    retreiveCompanyWebsite: (data?: string, params: RequestParams = {}) =>
      this.request<
        CompanyWebsite[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/company_websites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  covers = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveCover
     * @summary The cover art of games
     * @request POST:/covers
     * @secure
     */
    retreiveCover: (data?: string, params: RequestParams = {}) =>
      this.request<
        Cover[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/covers`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  dateFormat = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveDateFormat
     * @summary The Date Format
     * @request POST:/date_format
     * @secure
     */
    retreiveDateFormat: (data?: string, params: RequestParams = {}) =>
      this.request<
        DateFormat[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/date_format`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveEvents
     * @summary Gaming event like GamesCom, Tokyo Game Show, PAX or GSL
     * @request POST:/events
     * @secure
     */
    retreiveEvents: (data?: string, params: RequestParams = {}) =>
      this.request<
        Event[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/events`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  eventLogos = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveEventLogo
     * @summary Logo for the event
     * @request POST:/event_logos
     * @secure
     */
    retreiveEventLogo: (data?: string, params: RequestParams = {}) =>
      this.request<
        EventLogo[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/event_logos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  eventNetworks = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveEventNetwork
     * @summary Urls related to the event like twitter, facebook and youtube
     * @request POST:/event_networks
     * @secure
     */
    retreiveEventNetwork: (data?: string, params: RequestParams = {}) =>
      this.request<
        EventNetwork[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/event_networks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  franchises = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveFranchise
     * @summary A list of video game franchises such as Star Wars.
     * @request POST:/franchises
     * @secure
     */
    retreiveFranchise: (data?: string, params: RequestParams = {}) =>
      this.request<
        Franchise[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/franchises`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  games = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGames
     * @summary Video Games!
     * @request POST:/games
     * @secure
     */
    retreiveGames: (data?: string, params: RequestParams = {}) =>
      this.request<
        Games[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/games`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameEngines = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameEngine
     * @summary Video game engines such as unreal engine.
     * @request POST:/game_engines
     * @secure
     */
    retreiveGameEngine: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameEngine[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_engines`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameEngineLogos = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameEngineLogo
     * @summary The logos of game engines
     * @request POST:/game_engine_logos
     * @secure
     */
    retreiveGameEngineLogo: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameEngineLogo[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_engine_logos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  externalGames = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveExternalGame
     * @summary Game IDs on other services
     * @request POST:/external_games
     * @secure
     */
    retreiveExternalGame: (data?: string, params: RequestParams = {}) =>
      this.request<
        ExternalGame[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/external_games`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  externalGameSources = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveExternalGameSource
     * @summary Sources for the external games
     * @request POST:/external_game_sources
     * @secure
     */
    retreiveExternalGameSource: (data?: string, params: RequestParams = {}) =>
      this.request<
        ExternalGameSource[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/external_game_sources`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameVersions = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameVersion
     * @summary Details about game editions and versions.
     * @request POST:/game_versions
     * @secure
     */
    retreiveGameVersion: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameVersion[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_versions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameModes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameMode
     * @summary Single player, Multiplayer etc
     * @request POST:/game_modes
     * @secure
     */
    retreiveGameMode: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameMode[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_modes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameReleaseFormats = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameReleaseFormat
     * @summary The format of the game release
     * @request POST:/game_release_formats
     * @secure
     */
    retreiveGameReleaseFormat: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameReleaseFormat[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_release_formats`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameTimeToBeats = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameTimeToBeat
     * @summary Single player, Multiplayer etc
     * @request POST:/game_time_to_beats
     * @secure
     */
    retreiveGameTimeToBeat: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameTimeToBeat[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_time_to_beats`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameVersionFeatures = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveVersionFeatures
     * @summary Features and descriptions of what makes each version/edition different from the main game
     * @request POST:/game_version_features
     * @secure
     */
    retreiveVersionFeatures: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameVersionFeatures[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_version_features`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameVersionFeatureValues = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveVersionFeatureValue
     * @summary The bool/text value of the feature
     * @request POST:/game_version_feature_values
     * @secure
     */
    retreiveVersionFeatureValue: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameVersionFeatureValue[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_version_feature_values`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  genres = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGenre
     * @summary Genres of video game
     * @request POST:/genres
     * @secure
     */
    retreiveGenre: (data?: string, params: RequestParams = {}) =>
      this.request<
        Genre[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/genres`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  involvedCompanies = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveInvolvedCompany
     * @summary Companies involved with the game
     * @request POST:/involved_companies
     * @secure
     */
    retreiveInvolvedCompany: (data?: string, params: RequestParams = {}) =>
      this.request<
        InvolvedCompany[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/involved_companies`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameVideos = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameVideo
     * @summary A video associated with a game
     * @request POST:/game_videos
     * @secure
     */
    retreiveGameVideo: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameVideo[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_videos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  keywords = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveKeyword
     * @summary Keywords are words or phrases that get tagged to a game such as “world war 2” or “steampunk”.
     * @request POST:/keywords
     * @secure
     */
    retreiveKeyword: (data?: string, params: RequestParams = {}) =>
      this.request<
        Keyword[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/keywords`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  languages = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveLanguage
     * @summary Languages that are used in the Language Support endpoint.
     * @request POST:/languages
     * @secure
     */
    retreiveLanguage: (data?: string, params: RequestParams = {}) =>
      this.request<
        Language[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/languages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  gameLocalizations = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveGameLocalization
     * @summary Game localization for a game
     * @request POST:/game_localizations
     * @secure
     */
    retreiveGameLocalization: (data?: string, params: RequestParams = {}) =>
      this.request<
        GameLocalization[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/game_localizations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  languageSupportTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveLanguageSupportType
     * @summary Language Support Types contains the identifiers for the support types that Language Support uses.
     * @request POST:/language_support_types
     * @secure
     */
    retreiveLanguageSupportType: (data?: string, params: RequestParams = {}) =>
      this.request<
        LanguageSupportType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/language_support_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  multiplayerModes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveMultiplayerMode
     * @summary Data about the supported multiplayer types
     * @request POST:/multiplayer_modes
     * @secure
     */
    retreiveMultiplayerMode: (data?: string, params: RequestParams = {}) =>
      this.request<
        MultiplayerMode[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/multiplayer_modes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  languageSupports = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveLanguageSupport
     * @summary Games can be played with different languages for voice acting, subtitles, or the interface language.
     * @request POST:/language_supports
     * @secure
     */
    retreiveLanguageSupport: (data?: string, params: RequestParams = {}) =>
      this.request<
        LanguageSupport[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/language_supports`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  networkTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveNetworkType
     * @summary Social networks related to the event like twitter, facebook and youtube
     * @request POST:/network_types
     * @secure
     */
    retreiveNetworkType: (data?: string, params: RequestParams = {}) =>
      this.request<
        NetworkType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/network_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformFamilies = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformFamily
     * @summary A collection of closely related platforms
     * @request POST:/platform_families
     * @secure
     */
    retreivePlatformFamily: (data?: string, params: RequestParams = {}) =>
      this.request<
        PlatformFamily[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_families`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformLogos = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformLogo
     * @summary Logo for a platform
     * @request POST:/platform_logos
     * @secure
     */
    retreivePlatformLogo: (data?: string, params: RequestParams = {}) =>
      this.request<
        PlatformLogo[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_logos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformVersionCompanies = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformVersionCompany
     * @summary A platform developer
     * @request POST:/platform_version_companies
     * @secure
     */
    retreivePlatformVersionCompany: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        PlatformVersionCompany[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_version_companies`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platforms = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatform
     * @summary The hardware used to run the game or game delivery network
     * @request POST:/platforms
     * @secure
     */
    retreivePlatform: (data?: string, params: RequestParams = {}) =>
      this.request<
        Platform[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platforms`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformVersions = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformVersions
     * @summary Information about a particular platform's version/generation
     * @request POST:/platform_versions
     * @secure
     */
    retreivePlatformVersions: (data?: string, params: RequestParams = {}) =>
      this.request<
        PlatformVersion[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_versions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformVersionReleaseDates = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformVersionReleaseDate
     * @summary A handy endpoint that extends platform release dates. Used to dig deeper into release dates, platforms and versions.
     * @request POST:/platform_version_release_dates
     * @secure
     */
    retreivePlatformVersionReleaseDate: (
      data?: string,
      params: RequestParams = {},
    ) =>
      this.request<
        PlatformVersionReleaseDate[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_version_release_dates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  platformWebsites = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlatformWebsite
     * @summary The main website for the platform
     * @request POST:/platform_websites
     * @secure
     */
    retreivePlatformWebsite: (data?: string, params: RequestParams = {}) =>
      this.request<
        PlatformWebsite[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/platform_websites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  playerPerspectives = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePlayerPerspective
     * @summary Player perspectives describe the view/perspective of the player in a video game.
     * @request POST:/player_perspectives
     * @secure
     */
    retreivePlayerPerspective: (data?: string, params: RequestParams = {}) =>
      this.request<
        PlayerPerspective[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/player_perspectives`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  popularityPrimatives = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePopularityPrimative
     * @summary This endpoint lists available primitives with their source and popularity type.
     * @request POST:/popularity_primatives
     * @secure
     */
    retreivePopularityPrimative: (data?: string, params: RequestParams = {}) =>
      this.request<
        PopularityPrimative[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/popularity_primatives`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  popularityTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreivePopularityType
     * @summary This describes what type of popularity primitive or popularity indicator the popularity value is.
     * @request POST:/popularity_types
     * @secure
     */
    retreivePopularityType: (data?: string, params: RequestParams = {}) =>
      this.request<
        PopularityType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/popularity_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  regions = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveRegion
     * @summary Region for game localization
     * @request POST:/regions
     * @secure
     */
    retreiveRegion: (data?: string, params: RequestParams = {}) =>
      this.request<
        Region[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/regions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  releaseDates = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveReleaseDate
     * @summary A handy endpoint that extends game release dates. Used to dig deeper into release dates, platforms and versions.
     * @request POST:/release_dates
     * @secure
     */
    retreiveReleaseDate: (data?: string, params: RequestParams = {}) =>
      this.request<
        ReleaseDate[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/release_dates`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  releaseDateRegions = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveReleaseDateRegion
     * @summary Regions for release dates
     * @request POST:/release_date_regions
     * @secure
     */
    retreiveReleaseDateRegion: (data?: string, params: RequestParams = {}) =>
      this.request<
        ReleaseDateRegion[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/release_date_regions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  releaseDateStatuses = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveReleaseDateStatus
     * @summary An endpoint to provide definition of all of the current release date statuses.
     * @request POST:/release_date_statuses
     * @secure
     */
    retreiveReleaseDateStatus: (data?: string, params: RequestParams = {}) =>
      this.request<
        ReleaseDateStatus[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/release_date_statuses`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  screenshots = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveScreenshot
     * @summary Screenshots of games
     * @request POST:/screenshots
     * @secure
     */
    retreiveScreenshot: (data?: string, params: RequestParams = {}) =>
      this.request<
        Screenshot[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/screenshots`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  search = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveSearch
     * @summary Search IGDB!
     * @request POST:/search
     * @secure
     */
    retreiveSearch: (data?: string, params: RequestParams = {}) =>
      this.request<
        Search[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/search`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  themes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveTheme
     * @summary Video game themes
     * @request POST:/themes
     * @secure
     */
    retreiveTheme: (data?: string, params: RequestParams = {}) =>
      this.request<
        Theme[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/themes`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  websites = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveWebsite
     * @summary A website url, usually associated with a game
     * @request POST:/websites
     * @secure
     */
    retreiveWebsite: (data?: string, params: RequestParams = {}) =>
      this.request<
        Website[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/websites`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
  websiteTypes = {
    /**
     * No description
     *
     * @tags Endpoints
     * @name RetreiveWebsiteType
     * @summary A website type, usually the name of the website
     * @request POST:/website_types
     * @secure
     */
    retreiveWebsiteType: (data?: string, params: RequestParams = {}) =>
      this.request<
        WebsiteType[],
        | {
            title?: string;
            status?: number;
            cause?: string;
          }
        | {
            message?: string;
            "Tip 1"?: string;
            "Tip 2"?: string;
            "Tip 3"?: string;
            /** @format url */
            Docs?: string;
            /** @format url */
            Discord?: string;
          }
        | {
            title?: string;
            status?: number;
            cause?: string;
            details?: string;
          }
        | {
            title?: string;
            status?: number;
            type?: string;
            details?: string;
          }
      >({
        path: `/website_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Text,
        format: "json",
        ...params,
      }),
  };
}
