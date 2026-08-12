import { Logo } from "@/components/layout/logo";
import { SearchLauncher } from "@/components/layout/search-launcher";
import { SettingsLauncher } from "@/components/layout/settings-launcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui";

export function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-4">
          <Logo />

          <div className="flex flex-1 justify-center">
            <SearchLauncher />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsLauncher />
          </div>
        </div>
      </Container>
    </header>
  );
}
