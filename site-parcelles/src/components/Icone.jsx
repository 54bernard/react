import {Building2, FileCheck, Globe, HardHat, Map, Ruler, ShieldCheck, Wallet} from 'lucide-react';

const icones = {Building2, FileCheck, Globe, HardHat, Map, Ruler, ShieldCheck, Wallet};

// Affiche une icône Lucide à partir de son nom (utilisé par les données de data.js).
export default function Icone({nom, size = 24}) {
  const Composant = icones[nom] ?? ShieldCheck;
  return <Composant size={size} strokeWidth={1.8} aria-hidden="true" />;
}
