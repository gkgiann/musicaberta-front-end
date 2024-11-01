"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewSheetFormProps {
  userId: string;
}

export default function NewSheetForm({ userId }: NewSheetFormProps) {
  const [songWriter, setSongWriter] = useState("");
  const [title, setTitle] = useState("");
  const [badges, setBadges] = useState<string[]>([]);
  const [newBadge, setNewBadge] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!pdfFile) return;

    const formData = new FormData();
    formData.append("file", pdfFile as File);

    toast({
      title: "Fazendo upload...",
      description: `Salvando dados da partitura ${title}`,
    });

    const uploadResponse = await api.post("sheets/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { fileURL } = uploadResponse.data;

    await api.post("sheets", {
      title,
      songWriter,
      pdfUrl: fileURL,
      mp3Url: "",
      badges,
      userId,
    });

    toast({
      title: "Upload completo!",
      description: `Partitura ${title} foi salva com sucesso!`,
      className: "text-slate-50 bg-green-700",
    });

    setSongWriter("");
    setTitle("");
    setBadges([]);
    setNewBadge("");
    setPdfFile(null);
  };

  const addItem = (
    item: string,
    list: string[],
    setList: Dispatch<SetStateAction<string[]>>
  ) => {
    if (item.trim() && !list.includes(item)) {
      setList([...list, item]);
    }
  };

  const removeItem = (
    item: string,
    list: string[],
    setList: Dispatch<SetStateAction<string[]>>
  ) => {
    setList(list.filter((i) => i !== item));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          required
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da partitura"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="songWriter">Compositor</Label>
        <Input
          required
          id="songWriter"
          value={songWriter}
          onChange={(e) => setSongWriter(e.target.value)}
          placeholder="Compositor da partitura/música"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pdfUpload">Upload de PDF</Label>
        <Input
          required
          id="pdfUpload"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files) {
              setPdfFile(e.target.files[0]);
            }
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roles">Badges</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
            >
              {badge}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeItem(badge, badges, setBadges)}
              >
                <X className="h-3 w-3" />
              </Button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="newBadge"
            value={newBadge}
            onChange={(e) => setNewBadge(e.target.value)}
            placeholder="Adicionar uma nova badge.."
          />
          <Button
            type="button"
            onClick={() => {
              addItem(newBadge, badges, setBadges);
              setNewBadge("");
            }}
          >
            Nova badge
          </Button>
        </div>
      </div>
      <Button
        disabled={!pdfFile || !songWriter.trim() || !title.trim()}
        type="submit"
      >
        Salvar
      </Button>
    </form>
  );
}
