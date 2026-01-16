import { PageHeading } from "@/components/shared/PageHeading";
import LinkSimilarity from "../../components/link-similarity/LinkSimilarity";

const LinkSimilarityPage = () => {
  return (
    <>
      <title>Link Similarity - Core360</title>
      <main className="mt-1 flex h-full flex-col p-6">
        <PageHeading pageTitle="Link Similarity" />
        <LinkSimilarity />
      </main>
    </>
  );
};

export default LinkSimilarityPage;
