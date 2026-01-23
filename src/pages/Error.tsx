import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error = () => {
  const [searchParams] = useSearchParams();
  
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const errorDetails = searchParams.get("details");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {errorCode ? `Error ${errorCode}` : "Something Went Wrong"}
        </h1>
        
        <p className="mb-4 text-muted-foreground">
          {`${errorMessage}` || "An unexpected error occurred. Please try again later."}
        </p>
        
        {errorDetails && (
          <p className="mb-6 rounded-md bg-muted-foreground/10 p-3 text-sm text-muted-foreground">
            {errorDetails}
          </p>
        )}
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
