import { TypographyBody } from "@/components/ui/typography";
import { createClient } from "@/utils/supabase/server";
import { AllRevisionSetsClient } from "./client-page";

const Page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <TypographyBody>Please log in to see your sets.</TypographyBody>;
  }

  return <AllRevisionSetsClient userId={user.id} />;
};

export default Page;
