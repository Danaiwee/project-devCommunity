import { getTags } from "@/lib/actions/tag.action";


const Tags = async ({searchParams}: RouteParams) => {
  const {page, pageSize, query, filter} = await searchParams;

  const {success, data, errors} = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query: query || "javascript"
  });

  return (
    <div>Tags</div>
  )
}

export default Tags