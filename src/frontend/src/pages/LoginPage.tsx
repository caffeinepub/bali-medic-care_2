import { Button } from "@/components/ui/button";
import { Shield, Stethoscope } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.22_0.055_215)] via-[oklch(0.28_0.06_210)] to-[oklch(0.20_0.05_220)] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            oklch(0.8 0.05 210) 0px,
            oklch(0.8 0.05 210) 1px,
            transparent 1px,
            transparent 24px
          )`,
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[oklch(0.38_0.085_205)] px-8 py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Bali Medic Care
            </h1>
            <p className="text-white/70 text-sm">dr. Romy Kamaluddin</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="text-center mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                Welcome
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to access the clinic management system
              </p>
            </div>

            <Button
              data-ocid="login.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-[oklch(0.38_0.085_205)] hover:bg-[oklch(0.32_0.09_205)] text-white h-11 rounded-lg font-medium"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Sign in with Internet Identity
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta
              <br />
              Phone: +62 818-588-911
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/40 mt-6">
          © 2026. Built with Lingga
        </p>
      </div>
    </div>
  );
}
