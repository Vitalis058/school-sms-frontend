import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function TeachersData() {
  return (
    <div>
      <p>Teachers data</p>
      <Button>
        <Link href={"/dashboard/users/teachers/new"}>Add new teacher</Link>
      </Button>
    </div>
  );
}

export default TeachersData;
