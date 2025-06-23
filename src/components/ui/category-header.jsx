export default function CategoryHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-xl lg:text-3xl font-bold lg:mb-2">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
