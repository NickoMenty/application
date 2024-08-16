import fs from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export default class FilePrismaRepository implements FileRepository {
  constructor(protected db: Omit<PrismaClient, runtime.ITXClientDenyList>) {}

  async list(where: FileFilters): Promise<FileDto[]> {
    return this.db.file.findMany({ where });
  }

  async create(file: File, options: CreateFileDto): Promise<void> {
    const buffer = new Uint8Array(await file.arrayBuffer());

    const dir = `./public/${options.entity}/${options.entityId}`;

    await fs.mkdir(dir, { recursive: true });

    const filePath = `${dir}/${options.name}`;
    await fs.writeFile(filePath, buffer);

    await this.db.file.create({
      data: {
        path: `/${options.entity}/${options.entityId}/${options.name}`,
        entity: options.entity,
        entityId: options.entityId,
      },
    });
  }

  async delete(id: FileId): Promise<void> {
    const file = await this.db.file.findFirst({ where: { id } });
    if (file) {
      await fs.unlink(`./public/${file.path}`);
      await this.db.file.delete({ where: { id } });
    }
  }
}
