import { CATEGORIES } from "../data/productsData";
import { CEO_MESSAGE } from "../data/eventsData";
import { SANCHALAK_SAMITI, LEKHA_SAMITI, STAFF, VISION, MEMBER_COOPS } from "../data/membersData";
import { SITE_INFO, USEFUL_LINKS } from "../data/siteData";

export const FOOTER_ABOUT =
  "कोशी प्रदेश अन्तर्गत रहेका थोक उपभोक्ता विशिष्टीकृत सहकारी संघ लि. यस प्रदेशका साविक मेची, कोशी, सगरमाथा लगायतका विभिन्न जिल्लाहरुबाट उत्पादित वस्तु तथा उपभोग्य खाद्यान्न सामाग्रीहरुको थोक आपूर्ति गर्न स्थापना भएको हो।";

export const CEO_SIDE_NOTE =
  "Umbrella of cooperatives — marketing goods & services, empowering entrepreneurs.";

export const CEO_BADGE_ONE = "Vision: Sustainable cooperative business";
export const CEO_BADGE_TWO = "First of its kind in Nepal";

export const FOOTER_LOCATION = "Damak-9, Jhapa, Nepal";
export const FOOTER_COPYRIGHT_YEAR = "2026";

/**
 * Fallback for every editable content block. Anything the admin panel has not
 * saved yet keeps these values, so the public site always renders.
 */
export const CONTENT_DEFAULTS = {
  siteInfo: {
    name: SITE_INFO.name,
    englishName: SITE_INFO.englishName,
    phone: SITE_INFO.phone,
    altPhone: SITE_INFO.altPhone,
    email: SITE_INFO.email,
    address: SITE_INFO.address,
    web: SITE_INFO.web,
    establishedDate: SITE_INFO.establishedDate,
    regNo: SITE_INFO.regNo,
    regOffice: SITE_INFO.regOffice,
    tickerText: SITE_INFO.tickerText,
  },
  footer: {
    about: FOOTER_ABOUT,
    links: USEFUL_LINKS,
    location: FOOTER_LOCATION,
    copyrightYear: FOOTER_COPYRIGHT_YEAR,
  },
  ceo: {
    name: CEO_MESSAGE.name,
    role: CEO_MESSAGE.role,
    image: CEO_MESSAGE.image,
    message: CEO_MESSAGE.message,
    sideNote: CEO_SIDE_NOTE,
    badgeOne: CEO_BADGE_ONE,
    badgeTwo: CEO_BADGE_TWO,
  },
  committees: {
    sanchalak: SANCHALAK_SAMITI,
    lekha: LEKHA_SAMITI,
  },
  staff: STAFF,
  vision: VISION,
  memberCoops: MEMBER_COOPS,
  categories: CATEGORIES,
};
