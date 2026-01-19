import { useSearchParams } from "react-router-dom";
import { Wrench, Clock } from "lucide-react";

const Maintenance = () => {
  const [searchParams] = useSearchParams();
  
  const scheduledEnd = searchParams.get("until");
  const reason = searchParams.get("reason");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Scheduled Maintenance
        </h1>
        
        <p className="mb-4 text-muted-foreground">
          {reason || "We're performing scheduled maintenance to improve your experience. We'll be back shortly."}
        </p>
        
        {scheduledEnd && (
          <div className="mb-6 flex items-center justify-center gap-2 rounded-md bg-primary/10 p-3 text-sm text-foreground">
            <Clock className="h-4 w-4" />
            <span>Expected completion: {scheduledEnd}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          Thank you for your patience. If you have urgent concerns, please contact support.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
