const SERVICE_AREAS = [
  {
    name: "Huntingdonshire",
    places: "Godmanchester, Hemingford Grey, Hemingford Abbots, Houghton, Wyton, Brampton, Buckden, Offord Cluny, Offord Darcy, Great Paxton, Little Paxton, St Neots, Eaton Socon, Eaton Ford, Abbotsley, Grafham, Perry, Great Staughton, Little Staughton, Kimbolton, Tilbrook, Huntingdon.",
  },
  {
    name: "Fenland District",
    places: "Peterborough, Yaxley, Stilton, Folksworth, Sawtry, Glatton, Holme, Ramsey, Ramsey St Mary's, Ramsey Mereside, Bury, Warboys, Pidley, Somersham, Earith, Bluntisham, Colne, March, Chatteris, Wimblington, Whittlesey, Coates, Thorney.",
  },
  {
    name: "South Cambridgeshire",
    places: "St Ives, Fenstanton, Fen Drayton, Swavesey, Over, Willingham, Longstanton, Oakington, Bar Hill, Dry Drayton, Girton, Cambridge (all areas), Milton, Waterbeach, Landbeach, Cottenham, Histon, Impington, Ely, Littleport, Stretham, Sutton, Witchford, Haddenham, Wilburton, Great Gransden, Little Gransden, Cambourne, Caxton, Bourn, Papworth Everard, Hilton, Elsworth.",
  },
  {
    name: "North Bedfordshire",
    places: "Wyboston, Tempsford, Sandy, Potton, Biggleswade, Langford, Broom, Moggerhanger, Roxton, Bedford (all areas), Clapham, Oakley, Bromham, Turvey, Olney, Harrold, Carlton, Sharnbrook, Riseley, Swineshead, Pertenhall, Stagsden.",
  },
  {
    name: "North Northamptonshire",
    places: "Wellingborough, Rushden, Higham Ferrers, Irthlingborough, Raunds, Stanwick, Thrapston, Oundle, Warmington.",
  },
  {
    name: "Rutland & Stamford Area",
    places: "Stamford, Barnack, Bainton, Helpston, Wittering, Collyweston, Ketton, Tinwell, Uffington, Ryhall.",
  },
];

export default function AreasCoveredSection() {
  return (
    <section style={{ background: "#0C0C0C", padding: "3rem 0" }}>
      <div className="container">
        <h2 className="font-playfair text-2xl text-gold mb-3">Plumbing Coverage Around Huntingdon</h2>
        <p className="max-w-3xl text-sm leading-7 text-[#F0EAD6] mb-6">
          Jason covers selected towns and villages within approximately a 50-minute drive. Availability depends on the exact location and job.
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_AREAS.map((area) => (
            <li key={area.name}>
              <h3 className="font-semibold text-[#C9A84C] mb-1">{area.name}</h3>
              <p className="text-sm leading-6 text-[#F0EAD6]">{area.places}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
