"use client"

import * as React from "react"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n-context"
import { createTorrent } from "@/lib/torrent-create"

const download = (data: BlobPart, name: string) => {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([data]))
  a.download = name
  a.click()
  URL.revokeObjectURL(a.href)
}

export function CreateTorrentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = React.useState<File>()
  const [announce, setAnnounce] = React.useState("")
  const [comment, setComment] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const { t } = useI18n()

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setFile(undefined)
      setAnnounce("")
      setComment("")
    }
  }

  const handleCreate = async () => {
    if (!file) return
    setBusy(true)
    try {
      const { torrent, nfo } = await createTorrent(file, { announce, comment })
      download(torrent, `${file.name}.torrent`)
      download(nfo, `${file.name}.nfo`)
      toast.success(t("common.create_success", "Torrent created"))
      handleOpenChange(false)
    } catch (err) {
      console.error("Failed to create torrent:", err)
      toast.error(t("common.create_failed", "Failed to create torrent"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("common.create_torrent", "Create Torrent")}</DialogTitle>
          <DialogDescription>
            {t(
              "common.create_torrent_desc",
              "Pick a file to generate a .torrent and its .nfo.",
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
          <Input
            placeholder={t("common.tracker_url", "Tracker URL (optional)")}
            value={announce}
            onChange={(e) => setAnnounce(e.target.value)}
          />
          <Input
            placeholder={t("common.comment", "Comment (optional)")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!file || busy}>
            {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {t("common.create", "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
