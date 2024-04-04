const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full overflow-y-auto dark:bg-[#1F1F1F]">{children}</div>
}

export default PublicLayout
