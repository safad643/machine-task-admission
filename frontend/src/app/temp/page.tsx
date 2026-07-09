import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Loader,
  Layout,
  type NavItem,
} from "@/components/ui";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "#dashboard", icon: <span>◆</span> },
  { label: "Students", href: "#students", icon: <span>◎</span>, active: true },
  { label: "Exam Slots", href: "#slots", icon: <span>◷</span> },
  { label: "Applications", href: "#applications", icon: <span>◇</span> },
];

export default function TempComponentsPage() {
  return (
    <Layout
      title="Component Preview"
      navItems={navItems}
      user={{ name: "Jane Doe", role: "Admission Team" }}
    >
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Banner */}
        <div className="rounded-lg border border-brass/30 bg-brass/10 px-4 py-3 text-sm text-brass">
          <span className="font-semibold">Temporary page:</span> preview of the
          shared UI components built for Phase 7.6.
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Variants & sizes</CardTitle>
              <CardDescription>
                Primary, secondary, outline, ghost, and danger styles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button leftIcon={<span>+</span>}>With icon</Button>
                <Button variant="outline" fullWidth className="max-w-xs">
                  Full width
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Inputs</h2>
          <Card>
            <CardHeader>
              <CardTitle>Form fields</CardTitle>
              <CardDescription>
                Labels, helper text, inline validation, and disabled states.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <Input label="Full name" placeholder="Enter student name" required />
              <Input
                label="Email address"
                type="email"
                placeholder="parent@example.com"
                helperText="We will use this for all admission updates."
              />
              <Input
                label="Date of birth"
                type="date"
                error="Date of birth is required."
              />
              <Input label="Previous school" placeholder="e.g. Lincoln Elementary" disabled />
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Status badges</CardTitle>
              <CardDescription>
                Used for admission workflow status indicators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Admitted</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="danger">Rejected</Badge>
                <Badge size="sm">Small badge</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Loaders */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Loaders</h2>
          <Card>
            <CardHeader>
              <CardTitle>Loading spinners</CardTitle>
              <CardDescription>Sizes and colors for async states.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                <Loader size="sm" />
                <Loader size="md" />
                <Loader size="lg" />
                <Loader size="md" color="danger" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Cards</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card with footer</CardTitle>
                <CardDescription>
                  Cards group related actions and content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate">
                  This card uses the compound Card subcomponents: header, title,
                  description, content, and footer.
                </p>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>

            <Card className="bg-paper">
              <CardHeader>
                <CardTitle>Plain card</CardTitle>
                <CardDescription>
                  A compact panel with only header and content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Applications</span>
                  <Badge variant="secondary">128 total</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Layout note */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Layout</h2>
          <Card>
            <CardHeader>
              <CardTitle>Dashboard shell</CardTitle>
              <CardDescription>
                Responsive sidebar, mobile menu, header, and main content area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate">
                The Layout component wraps this entire page. Resize the browser to
                see the sidebar collapse into a mobile hamburger menu.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
