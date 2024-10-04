export interface Person {
  id: number;
  name: string;
  lat: string | null;
  lng: string | null;
  googlemapurl: string | null;
  town: string | null;
  deathdate: string | null;
  age: number | null;
  dob: string | null;
  misc: string | null;
  slug: string;
}

// Function to convert a string to kebab-case
const toKebabCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, ""); // Remove any leading or trailing hyphens
};

// Function to extract first and last names
const getFirstAndLastName = (fullName: string) => {
  const nameParts = fullName.split(" ");
  return {
    firstName: nameParts[0],
    lastName: nameParts[nameParts.length - 1], // Assuming the last part of the name is the last name
  };
};

// Define the people data
const peopleData: Omit<Person, "id" | "slug">[] = [
  {
    name: "tommie cook",
    lat: "54.000071", // Leaflet-readable decimal format
    lng: "-8.964408",
    googlemapurl: null,
    town: "knocks",
    deathdate: "06/01/1993",
    age: null,
    dob: null,
    misc: "husband of Bea",
  },
  {
    name: "bae cook",
    lat: "54.00408",
    lng: "-8.96447",
    googlemapurl: null,
    town: "knocks",
    deathdate: "12/06/1996",
    age: null,
    dob: null,
    misc: "wife of tommie",
  },
  // {
  //   name: "daniel conlon",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "boleboy, killasser",
  //   deathdate: "31/03/1983",
  //   age: null,
  //   dob: null,
  //   misc: "husband of Mary and father of Dessie",
  // },
  // {
  //   name: "mary kate conlon",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "boleboy, killasser",
  //   deathdate: "5/01/2009",
  //   age: null,
  //   dob: null,
  //   misc: "(nee Kirrane) wife of daniel and mother of Dessie",
  // },
  // {
  //   name: "dessie conlon",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "boleboy, killasser",
  //   deathdate: "7/24/2012",
  //   age: null,
  //   dob: null,
  //   misc: "son of daniel and mary kate",
  // },
  // {
  //   name: "david conlon",
  //   lat: "54°0.257'N",
  //   lng: "8°57.832'W",
  //   googlemapurl: null,
  //   town: null,
  //   deathdate: null,
  //   age: null,
  //   dob: null,
  //   misc: null,
  // },
  // {
  //   name: "john mcmanus",
  //   lat: "54°0.258'N",
  //   lng: "8°57.835'W",
  //   googlemapurl: null,
  //   town: "cartron",
  //   deathdate: "09/08/1983",
  //   age: null,
  //   dob: null,
  //   misc: "husband of eileen",
  // },
  // {
  //   name: "eileen mcmanus",
  //   lat: "54°0.258'N",
  //   lng: "8°57.835'W",
  //   googlemapurl: null,
  //   town: "cartron",
  //   deathdate: "12/02/1990",
  //   age: null,
  //   dob: null,
  //   misc: "wife of john",
  // },
  {
    name: "philip howley",
    lat: "54.00408",
    lng: "-8.96447",
    googlemapurl: "http://maps.google.com/maps?q=54.00408%2C-8.96447",
    town: "killasser",
    deathdate: null,
    age: null,
    dob: null,
    misc: null,
  },
  {
    name: "martin loftus",
    lat: "54.00415",
    lng: "8.96399",
    googlemapurl: "http://maps.google.com/maps?q=54.00415%2C-8.96399",
    town: null,
    deathdate: null,
    age: null,
    dob: null,
    misc: null,
  },
  {
    name: "andy gallagher",
    lat: "54.00425",
    lng: "-8.96388",
    googlemapurl: "http://maps.google.com/maps?q=54.00425%2C-8.96388",
    town: null,
    deathdate: null,
    age: null,
    dob: null,
    misc: null,
  },
  {
    name: "mary henechan carrabeg",
    lat: "54.00427",
    lng: "-8.96892",
    googlemapurl: "http://maps.google.com/maps?q=54.00427%2C-8.96392",
    town: null,
    deathdate: null,
    age: null,
    dob: null,
    misc: null,
  },
  {
    name: "may tuffy",
    lat: "54.00429",
    lng: "-8.96394",
    googlemapurl: "http://maps.google.com/maps?q=54.00429%2C-8.96394",
    town: "Doonmaynor",
    deathdate: "07/05/1984",
    age: 61,
    dob: null,
    misc: "wife of thomas",
  },
  {
    name: "thomas tuffy",
    lat: "54.00429",
    lng: "-8.96394",
    googlemapurl: "http://maps.google.com/maps?q=54.00429%2C-8.96394",
    town: "Doonmaynor",
    deathdate: "22/01/1995",
    age: 77,
    dob: null,
    misc: "husband of may",
  },
  {
    name: "eamon doherty",
    lat: "54.00431",
    lng: "-8.96396",
    googlemapurl: "http://maps.google.com/maps?q=54.00431%2C-8.96396",
    town: null,
    deathdate: null,
    age: null,
    dob: null,
    misc: null,
  },
  // {
  //   name: "thomas burke",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "parkroe",
  //   deathdate: "09/01/2017",
  //   age: 77,
  //   dob: null,
  //   misc: null,
  // },
  // {
  //   name: "josephine burke",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "parkroe",
  //   deathdate: "08/28/1994",
  //   age: null,
  //   dob: null,
  //   misc: null,
  // },
  // {
  //   name: "thomas burke",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "parkroe",
  //   deathdate: "02/04/1986",
  //   age: null,
  //   dob: null,
  //   misc: null,
  // },
  // {
  //   name: "mary heneghan",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "carrabeg",
  //   deathdate: "10/02/1984",
  //   age: null,
  //   dob: null,
  //   misc: "sister of james",
  // },
  // {
  //   name: "james heneghan",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "carrabeg",
  //   deathdate: "6/04/1986",
  //   age: null,
  //   dob: null,
  //   misc: "brother of mary",
  // },
  // {
  //   name: "martin t mcmanus",
  //   lat: null,
  //   lng: null,
  //   googlemapurl: null,
  //   town: "carramore",
  //   deathdate: "01/12/1983",
  //   age: 58,
  //   dob: null,
  //   misc: null,
  // },
];

// Add an incrementing ID and generate slugs using first name, last name, and id
const people: Person[] = peopleData.map((person, index) => {
  const id = index + 1;
  const { firstName, lastName } = getFirstAndLastName(person.name);
  const slug = `${toKebabCase(firstName)}-${toKebabCase(lastName)}-${id}`;
  return {
    ...person,
    id,
    slug,
  };
});

export default people;
