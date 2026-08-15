import type { ProductReview } from "./products";

const duo: ProductReview[] = [
  { name: "Sara", city: "Casablanca", rating: 5, text: "Je lisse un jour, j’ondule le lendemain. Un seul outil dans le tiroir." },
  { name: "Imane", city: "Rabat", rating: 5, text: "Cran 1 pour moi. Ça glisse, sans tirer le cheveu." },
  { name: "Nadia", city: "Marrakech", rating: 4, text: "Les waves tiennent si je laisse refroidir. J’ai appris en deux soirs." },
  { name: "Khadija", city: "Fès", rating: 5, text: "Ouvert devant le livreur. Prise de la maison, sans adaptateur." },
];

const trio: ProductReview[] = [
  { name: "Amina", city: "Casablanca", rating: 5, text: "Brosse le matin, lisseur le soir. Le coffret est vraiment complet." },
  { name: "Salma", city: "Tanger", rating: 4, text: "Trois outils, un écrin. Je n’achète plus le reste." },
  { name: "Nour", city: "Rabat", rating: 5, text: "Le cran froid fixe le brushing. Ça se voit tout de suite." },
  { name: "Houda", city: "Agadir", rating: 5, text: "Cadeau pour ma sœur. Elle a ouvert, elle a gardé." },
];

const soft: ProductReview[] = [
  { name: "Meriem", city: "Casablanca", rating: 5, text: "Cheveux épais. Un passage, moins de frisottis qu’avant." },
  { name: "Laila", city: "Meknès", rating: 4, text: "Un peu lourd au début, après c’est le geste. Le résultat est lisse." },
  { name: "Yasmine", city: "Salé", rating: 5, text: "Je sèche et je coiffe en même temps. Ça me coupe le temps." },
  { name: "Sanae", city: "Kenitra", rating: 5, text: "Cran 2. Mes boucles se tiennent sans coller." },
];

const jour: ProductReview[] = [
  { name: "Fatima", city: "Rabat", rating: 5, text: "Le matin avant le travail. Dix minutes, look net." },
  { name: "Ghita", city: "Casablanca", rating: 4, text: "Léger, simple. Pas un salon, mais ça se voit." },
  { name: "Rim", city: "Oujda", rating: 5, text: "Je l’utilise tous les jours. Plus de sèche-cheveux à part." },
  { name: "Ibtissam", city: "Tétouan", rating: 5, text: "Arrivé en 48 h. J’ai inspecté, puis payé." },
];

const volume: ProductReview[] = [
  { name: "Soukaina", city: "Marrakech", rating: 5, text: "Du volume dès les racines. Mon brushing tient jusqu’au soir." },
  { name: "Chaimae", city: "Casablanca", rating: 5, text: "Un seul geste. Plus de brosse + sèche-cheveux." },
  { name: "Aya", city: "Rabat", rating: 4, text: "Cheveu fin : cran 1. Ça gonfle sans casser." },
  { name: "Zineb", city: "Fès", rating: 5, text: "On dirait que je sors du salon. Chez moi." },
];

const go: ProductReview[] = [
  { name: "Hajar", city: "Tanger", rating: 5, text: "Dans le sac. Une retouche avant une réunion, c’est réglé." },
  { name: "Meryem", city: "Casablanca", rating: 4, text: "Petit, ça chauffe vite. Parfait en voyage." },
  { name: "Nada", city: "Agadir", rating: 5, text: "Je le laisse au bureau. Plus de mèche plate à 16 h." },
  { name: "Oumaima", city: "Rabat", rating: 5, text: "Léger. Je l’oublie dans le sac, et il est là." },
];

const BY_SLUG: Record<string, ProductReview[]> = {
  "raonaq-duo": duo,
  "raonaq-trio": trio,
  "raonaq-air-soft": soft,
  "raonaq-air-pink": jour,
  "raonaq-volume": volume,
  "raonaq-go": go,
};

export function voicesForProduct(slug: string): ProductReview[] {
  return BY_SLUG[slug] ?? duo;
}
