import { PublicationSectionType } from "@prisma/client"
// import { PublicationSectionType } from "./data"

function getPublicationSection(section: string) {
  return section.replaceAll(".", "_") as PublicationSectionType
}

class Publication {
  publicationDate: Date;
  publicationIdentifier: any;
  publicationPage: number | null;
  publicationSection: string | null;

  constructor(publicationNode: any) {
    const { PublicationIdentifier, PublicationSection, PublicationDate, PublicationPage } = publicationNode;

    this.publicationDate = new Date(PublicationDate[0]);
    this.publicationIdentifier = PublicationIdentifier[0];
    this.publicationPage = PublicationPage != null ? Number.parseInt(PublicationPage[0]) : null;
    this.publicationSection = PublicationSection != null ? getPublicationSection(PublicationSection[0]) : null;
  }
}

export { Publication }