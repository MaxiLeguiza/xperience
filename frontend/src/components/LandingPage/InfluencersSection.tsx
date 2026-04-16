import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Instagram, Youtube, Trophy } from 'lucide-react';

interface Influencer {
  id: number;
  name: string;
  sport: string;
  followers: string;
  image: string;
  achievements: string;
  instagram?: string;
  youtube?: string;
}

const influencers: Influencer[] = [
  {
    id: 1,
    name: 'Alex Thunder',
    sport: 'Paracaidismo',
    followers: '2.5M',
    image: 'https://images.unsplash.com/photo-1600729664711-816e87d1d667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHRyZW1lJTIwc3BvcnRzJTIwYXRobGV0ZXxlbnwxfHx8fDE3NjIxOTI3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'Campeón Mundial 2024',
    instagram: '@alexthunder',
    youtube: 'AlexThunderTV'
  },
  {
    id: 2,
    name: 'Sarah Heights',
    sport: 'Escalada',
    followers: '1.8M',
    image: 'https://images.unsplash.com/photo-1634248302461-df0f954e7b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBleHRyZW1lfGVufDF8fHx8MTc2MjIyODI5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'Record Free Solo 2023',
    instagram: '@sarahheights',
    youtube: 'SarahClimbs'
  },
  {
    id: 3,
    name: 'Marco Wave',
    sport: 'Surf',
    followers: '3.2M',
    image: 'https://images.unsplash.com/photo-1559934304-23e9010fcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJmaW5nJTIwYWN0aW9ufGVufDF8fHx8MTc2MjIyODMwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'Big Wave Award 2024',
    instagram: '@marcowave',
    youtube: 'MarcoWaveSurf'
  },
  {
    id: 4,
    name: 'Nina Sky',
    sport: 'Parapente',
    followers: '1.5M',
    image: 'https://images.unsplash.com/photo-1621669234477-a41d77bd60c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhZ2xpZGluZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjIxODU5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'Récord de Altura 2024',
    instagram: '@ninasky',
    youtube: 'NinaSkyFly'
  },
  {
    id: 5,
    name: 'Jake Mountain',
    sport: 'Mountain Bike',
    followers: '2.1M',
    image: 'https://images.unsplash.com/photo-1575548393466-0df1618ba410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2luZ3xlbnwxfHx8fDE3NjIxOTg3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'X Games Gold 2024',
    instagram: '@jakemountain',
    youtube: 'JakeMTB'
  },
  {
    id: 6,
    name: 'Emma Snow',
    sport: 'Snowboard',
    followers: '1.9M',
    image: 'https://images.unsplash.com/photo-1493053495438-e9655c0aaf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93Ym9hcmRpbmclMjBtb3VudGFpbnxlbnwxfHx8fDE3NjIyMjgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    achievements: 'Olimpiadas 2024',
    instagram: '@emmasnow',
    youtube: 'EmmaSnowboard'
  }
];

export function InfluencersSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white border-none">
            Atletas Destacados
          </Badge>
          <h2 className="mb-4 text-black text-[64px]">Influencers de Deportes Extremos</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-[24px] text-center">
            Conoce a los atletas más influyentes que están redefiniendo los límites de la aventura
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden hover:shadow-2xl hover:shadow-[#ef4444]/10 transition-all hover:-translate-y-2 group bg-white border-slate-200">
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={influencer.image}
                  alt={influencer.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white border-none">
                    {influencer.sport}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="mb-2 text-black text-[20px]">{influencer.name}</h3>
                <p className="text-slate-600 mb-4 text-[20px]">{influencer.followers} seguidores</p>
                
                <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-[#d86015]/10 to-[#ef4444]/10 rounded-lg">
                  <Trophy className="w-4 h-4 text-[#d86015]" />
                  <p className="text-black text-[15px]">{influencer.achievements}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  {influencer.instagram && (
                    <a 
                      href={`https://instagram.com/${influencer.instagram}`}
                      className="flex items-center gap-1 text-sm text-slate-600 hover:text-[#d86015] transition-all hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-[15px]">{influencer.instagram}</span>
                    </a>
                  )}
                  {influencer.youtube && (
                    <a 
                      href={`https://youtube.com/${influencer.youtube}`}
                      className="flex items-center gap-1 text-sm text-slate-600 hover:text-[#d86015] transition-all hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="w-4 h-4" />
                      <span className="text-[13px]">{influencer.youtube}</span>
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
