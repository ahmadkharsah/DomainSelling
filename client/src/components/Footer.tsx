export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-primary/30">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Premium Domain Sale. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
