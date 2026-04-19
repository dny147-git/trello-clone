import FormPopover from "@/components/form/form-popover";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import MobileSidebar from "./mobile-sidebar";

export default function Navbar() {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      {/* TODO: Mobile Sidebar */}
      <MobileSidebar />
      <div className="flex items-center gap-x-4 ">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover sideOffset={18} align="start" side="bottom">
          <Button
            size={"sm"}
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
            variant={"primary"}
          >
            Create
          </Button>
        </FormPopover>
        <Button
          size={"sm"}
          className="rounded-sm  md:hidden flex items-center justify-center"
          variant={"primary"}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2 ">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl={"/organization/:id"}
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl={"/organization/:id"}
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
}
