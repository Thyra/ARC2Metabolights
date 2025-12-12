/**
 * Type namespaces for ARC and MetaboLights domain models.
 * These can be used to map types from ARC to MetaboLights and vice versa.
 */

export type Comment = {
  name: string;
  value: string;
};

export namespace ARC {
  export type Role = {
    annotationValue: string;
    termSource?: string;
    termAccession?: string;
  };

  export type Contact = {
    "@id"?: string;
    firstName?: string;
    lastName?: string;
    midInitials?: string;
    email?: string;
    affiliation?: string;
    address?: string;
    phone?: string;
    fax?: string;
    roles?: Role[];
    comments?: Comment[];
  };
}

export namespace MetaboLights {
  export type Role = {
    annotationValue: string;
    termSource?: {
      name: string;
      file?: string;
      version?: string;
      description?: string;
      comments?: any[];
    };
    termAccession?: string;
    comments?: any[];
  };

  export type Contact = {
    firstName: string;
    lastName: string;
    midInitials?: string;
    email?: string;
    affiliation?: string;
    address?: string;
    phone?: string;
    fax?: string;
    roles?: Role[];
    comments?: Comment[];
  };
}
