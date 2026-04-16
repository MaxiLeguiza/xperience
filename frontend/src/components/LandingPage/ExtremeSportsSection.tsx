import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, Users, MapPin, ArrowRight } from 'lucide-react';

interface Sport {
  id: number;
  name: string;
  description: string;
  image: string;
  difficulty: string;
  participants: string;
  topLocation: string;
  rating: number;
}

const sports: Sport[] = [
  {
    id: 1,
    name: 'Paracaidismo',
    description: 'Experimenta la adrenalina de la caída libre desde miles de metros de altura',
    image: 'https://images.unsplash.com/photo-1665858843828-384327053055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza3lkaXZpbmclMjBwYXJhY2h1dGV8ZW58MXx8fHwxNzYyMTI2MDI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Extremo',
    participants: '1.2M+',
    topLocation: 'Dubai, EAU',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Escalada en Roca',
    description: 'Desafía la gravedad escalando las formaciones rocosas más impresionantes',
    image: 'https://images.unsplash.com/photo-1634248302461-df0f954e7b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwY2xpbWJpbmclMjBleHRyZW1lfGVufDF8fHx8MTc2MjIyODI5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Alto',
    participants: '2.5M+',
    topLocation: 'Yosemite, USA',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Surf de Olas Grandes',
    description: 'Domina las olas más grandes y poderosas del planeta',
    image: 'https://images.unsplash.com/photo-1559934304-23e9010fcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJmaW5nJTIwYWN0aW9ufGVufDF8fHx8MTc2MjIyODMwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Extremo',
    participants: '3.8M+',
    topLocation: 'Nazaré, Portugal',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Mountain Bike Extremo',
    description: 'Atraviesa terrenos imposibles en las montañas más desafiantes',
    image: 'https://images.unsplash.com/photo-1575548393466-0df1618ba410?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2luZ3xlbnwxfHx8fDE3NjIxOTg3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Alto',
    participants: '5.2M+',
    topLocation: 'Whistler, Canadá',
    rating: 4.7
  },
  {
    id: 5,
    name: 'Parapente',
    description: 'Vuela como un pájaro y disfruta de vistas panorámicas incomparables',
    image: 'https://images.unsplash.com/photo-1621669234477-a41d77bd60c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhZ2xpZGluZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NjIxODU5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Medio',
    participants: '1.8M+',
    topLocation: 'Interlaken, Suiza',
    rating: 4.8
  },
  {
    id: 6,
    name: 'Snowboard Freestyle',
    description: 'Realiza trucos épicos en las montañas nevadas más icónicas',
    image: 'https://images.unsplash.com/photo-1493053495438-e9655c0aaf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93Ym9hcmRpbmclMjBtb3VudGFpbnxlbnwxfHx8fDE3NjIyMjgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    difficulty: 'Alto',
    participants: '2.9M+',
    topLocation: 'Aspen, USA',
    rating: 4.9
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Extremo':
      return 'bg-[#d86015]/20 text-[#d86015] border-[#d86015]/40';
    case 'Alto':
      return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
    case 'Medio':
      return 'bg-black/20 text-black border-black/40';
    default:
      return 'bg-green-100 text-green-700 border-green-200';
  }
};

export function ExtremeSportsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black to-[#ef4444]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-[#ef4444] to-[#d86015] text-white border-none">
            Top Deportes 2024
          </Badge>
          <h2 className="mb-4 text-white text-[64px]">Mejores Deportes Extremos</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-[24px]">
            Descubre las disciplinas más emocionantes y desafiantes del mundo de los deportes extremos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <Card key={sport.id} className="overflow-hidden hover:shadow-2xl hover:shadow-[#16697A]/20 transition-all duration-300 group bg-white/5 backdrop-blur-sm border-white/10">
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <ImageWithFallback
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white mb-1">{sport.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(sport.rating)
                            ? 'text-[#d86015] fill-[#d86015]'
                            : 'text-gray-500'
                        }`}
                      />
                    ))}
                    <span className="text-white text-sm ml-2">{sport.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-white/90 mb-4 text-[20px]">{sport.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-[15px]">Dificultad</span>
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(sport.difficulty)}
                    >
                      {sport.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-4 h-4" />
                      <span className="text-[15px]">{sport.participants}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[13px]">{sport.topLocation}</span>
                    </div>
                  </div>
                </div>

                
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}