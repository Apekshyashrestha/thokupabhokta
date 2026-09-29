/**
 * Describes every editable content block shown in the admin Content section.
 * Field types: text | textarea | image | records (list of objects) | lines (list of strings)
 */
export const CONTENT_BLOCKS = [
  {
    id: "siteInfo",
    label: "Site & Contact",
    icon: "🏢",
    blurb: "Organisation name, phone numbers, email and address. These appear in the footer, header and contact page.",
    groups: [
      {
        label: "Organisation",
        fields: [
          { key: "name", label: "Official name (Nepali)", type: "text" },
          { key: "englishName", label: "Official name (English)", type: "text" },
          { key: "regNo", label: "Registration number", type: "text" },
          { key: "establishedDate", label: "Established date", type: "text" },
          { key: "regOffice", label: "Registration office", type: "text" },
        ],
      },
      {
        label: "Contact",
        fields: [
          { key: "phone", label: "Phone (landline)", type: "text" },
          { key: "altPhone", label: "Mobile number", type: "text", hint: "Used for WhatsApp links on the site." },
          { key: "email", label: "Email", type: "text" },
          { key: "address", label: "Address", type: "text" },
          { key: "web", label: "Website", type: "text" },
        ],
      },
      {
        label: "Ticker bar",
        fields: [
          {
            key: "tickerText",
            label: "Scrolling news text",
            type: "textarea",
            rows: 5,
            hint: "Separate items with | to show each one. This scrolls across the top of every page.",
          },
        ],
      },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    icon: "🦶",
    blurb: "The description text, useful links and location shown at the bottom of every page.",
    groups: [
      {
        label: "Footer text",
        fields: [
          { key: "about", label: "About paragraph", type: "textarea", rows: 5 },
          { key: "location", label: "Location line", type: "text" },
          { key: "copyrightYear", label: "Copyright year", type: "text" },
        ],
      },
      {
        label: "Useful links",
        fields: [
          {
            key: "links",
            label: "Links",
            type: "records",
            subFields: [
              { key: "name", label: "Link text", type: "text" },
              { key: "url", label: "URL", type: "text" },
            ],
            newRow: { name: "New link", url: "https://" },
          },
        ],
      },
    ],
  },
  {
    id: "ceo",
    label: "CEO Message",
    icon: "💬",
    blurb: "The message from the Chief Executive Officer, shown on the home page and the about page.",
    groups: [
      {
        label: "CEO",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "image", label: "Photo", type: "image" },
          { key: "message", label: "Message", type: "textarea", rows: 10, hint: "Line breaks are kept as written." },
          { key: "sideNote", label: "Note under the photo", type: "text" },
          { key: "badgeOne", label: "Green badge text", type: "text" },
          { key: "badgeTwo", label: "Grey badge text", type: "text" },
        ],
      },
    ],
  },
  {
    id: "committees",
    label: "Committees",
    icon: "👥",
    blurb: "Board members of the सञ्चालक and लेखा समिति, shown on the about page.",
    groups: [
      {
        label: "सञ्चालक समिति (Board)",
        fields: [
          {
            key: "sanchalak",
            label: "Members",
            type: "records",
            subFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "role", label: "Role", type: "text" },
            ],
            newRow: { name: "", role: "सदस्य" },
          },
        ],
      },
      {
        label: "लेखा समिति (Audit)",
        fields: [
          {
            key: "lekha",
            label: "Members",
            type: "records",
            subFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "role", label: "Role", type: "text" },
            ],
            newRow: { name: "", role: "सदस्य" },
          },
        ],
      },
    ],
  },
  {
    id: "staff",
    label: "Staff",
    icon: "🧑‍💼",
    blurb: "Office staff shown on the about page.",
    groups: [
      {
        label: "Staff members",
        fields: [
          {
            key: "staff",
            label: "Staff",
            type: "records",
            isRoot: true,
            subFields: [
              { key: "name", label: "Name", type: "text" },
              { key: "role", label: "Role", type: "text" },
              { key: "desc", label: "Description", type: "text" },
            ],
            newRow: { name: "", role: "", desc: "" },
          },
        ],
      },
    ],
  },
  {
    id: "vision",
    label: "Vision & Goals",
    icon: "🎯",
    blurb: "The vision paragraphs and bullet goals shown on the about page.",
    groups: [
      {
        label: "Vision",
        fields: [
          { key: "prishthabhumi", label: "Background (पृष्ठभूमि)", type: "textarea", rows: 8 },
          { key: "parikalpana", label: "Mission (परिकल्पना)", type: "textarea", rows: 3 },
          {
            key: "dhyeya",
            label: "Goals (ध्येय)",
            type: "lines",
            newRow: "",
            hint: "One goal per line.",
          },
        ],
      },
    ],
  },
  {
    id: "memberCoops",
    label: "Member Cooperatives",
    icon: "🏪",
    blurb: "The table of member cooperatives shown on the about page.",
    groups: [
      {
        label: "Members",
        fields: [
          {
            key: "memberCoops",
            label: "Cooperatives",
            type: "records",
            isRoot: true,
            subFields: [
              { key: "name", label: "Cooperative name", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "contact", label: "Contact", type: "text" },
              { key: "rep", label: "Representative", type: "text" },
            ],
            newRow: { name: "", address: "", contact: "", rep: "" },
          },
        ],
      },
    ],
  },
  {
    id: "categories",
    label: "Product Categories",
    icon: "🗂️",
    blurb: "The filter buttons on the products page. One category per line.",
    groups: [
      {
        label: "Categories",
        fields: [{ key: "categories", label: "Categories", type: "lines", isRoot: true, newRow: "" }],
      },
    ],
  },
];
