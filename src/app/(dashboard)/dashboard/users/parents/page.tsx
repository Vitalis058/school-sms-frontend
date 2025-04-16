import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function ParentsData() {
  return (
    <div>
      <p>Displays the parents data</p>
      <Button>
        <Link href={"/dashboard/users/parents/new"}>Add parent</Link>
      </Button>
    </div>
  );
}

export default ParentsData;
