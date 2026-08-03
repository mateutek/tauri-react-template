import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  profileSchema,
  type Profile,
  type ProfileInput,
} from "@/lib/schemas";

const PROFILE_KEY = "profile";

// Persisted JSON is untrusted: anything that no longer matches the schema is
// dropped rather than fed back into the form.
function loadProfile(): ProfileInput {
  let stored: unknown;
  try {
    stored = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null");
  } catch {
    stored = null; // corrupt JSON is just an absent profile
  }
  const saved = profileSchema.safeParse(stored).data;
  return { displayName: saved?.displayName ?? "", email: saved?.email ?? "" };
}

function SettingsView() {
  const navigate = useNavigate();

  // Three generics because the schema transforms: the fields hold ProfileInput
  // (email is ""), while a successful submit receives Profile (email is
  // undefined). Losing that distinction is how "" ends up in your database.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm<ProfileInput, unknown, Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: loadProfile(),
  });

  const onSubmit = (profile: Profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    reset({ displayName: profile.displayName, email: profile.email ?? "" });
  };

  return (
    <div className="mx-auto max-w-[760px] px-8 py-10">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-[15px] text-muted-foreground">
            Manage your app configuration
          </p>
        </div>
      </div>

      {/* Profile section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 rounded-xl border bg-card p-6 shadow-sm"
        noValidate
      >
        <h2 className="mb-5 text-base font-semibold tracking-tight">Profile</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display name
            </label>
            <Input
              id="displayName"
              placeholder="Ada Lovelace"
              aria-invalid={!!errors.displayName}
              aria-describedby={errors.displayName && "displayName-error"}
              {...register("displayName")}
            />
            {errors.displayName && (
              <p id="displayName-error" className="text-sm text-destructive">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ada@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email && "email-error"}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button type="submit" disabled={!isDirty}>
            Save
          </Button>
          {isSubmitSuccessful && !isDirty && (
            <span
              role="status"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Check className="size-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Appearance section */}
      <section className="mb-4 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold tracking-tight">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">Theme</span>
            <span className="text-sm text-muted-foreground">
              Light, dark, or follow your system
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </section>

      {/* Add more sections below as needed */}
    </div>
  );
}

export default SettingsView;
