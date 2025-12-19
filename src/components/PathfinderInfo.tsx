import { BookOpen, Video, FileText, QrCode, ExternalLink } from 'lucide-react';
import pathfinderBadge from '@/assets/pathfinder-badge.png';

const PathfinderInfo = () => {
  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
      {/* What is Pathfinder */}
      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">What is Pathfinder?</h2>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Text Content */}
          <div className="flex-1">
            <div className="info-box mb-4">
              <p className="mb-4">
                Your journey and search for Masonic light began in the Blue Lodge. After you were raised to the Sublime Degree of a Master Mason, the world of Freemasonry opened wide, providing many additional paths to pursue and explore.
              </p>
              <p className="mb-4">
                The Scottish Rite, NMJ extends the opportunity to journey to further light in Masonry through its twenty-nine degrees from the 4° through the 32°.
              </p>
              <p className="mb-4">
                To help Scottish Rite, NMJ Brethren continue their quest for self-improvement, the Supreme Council offers you the Pathfinder Program.
              </p>
              <p>
                Through participating in various activities and exploring the resources of the Scottish Rite, you embark on a transformative journey of growth and discovery.
              </p>
            </div>
          </div>

          {/* Badge and Actions */}
          <div className="lg:w-72 flex flex-col items-center gap-4">
            {/* Badge Image */}
            <div className="relative">
              <img 
                src={pathfinderBadge} 
                alt="Pathfinder Badge - The Journey of a Lifetime" 
                className="w-48 h-48 object-contain rounded-full shadow-lg animate-pulse-gold"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2">
              <button className="action-button w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <ExternalLink size={18} />
                <span>Pathfinder on SRNMJ.org</span>
              </button>
              <button className="action-button w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Video size={18} />
                <span>Video Library</span>
              </button>
              <button className="action-button w-full bg-muted text-foreground border border-border hover:bg-muted/80">
                <FileText size={18} />
                <span>Guide Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <QrCode size={40} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">Pathfinder on the Go</h3>
            <p className="text-sm text-muted-foreground">
              Scan this QR code to access these resources on your mobile device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfinderInfo;
