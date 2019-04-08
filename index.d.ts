// Type definitions for GeoStyler Data Models
// Project: https://github.com/terrestris/geostyler
// Definitions by: Christian Mayer <https://github.com/chrismayer>
// Definitions:
// TypeScript Version: 3.3.3

import { FeatureCollection, Geometry } from 'geojson';
import { JSONSchema4TypeName } from 'json-schema';

/**
 * Type represents a single property of an object according to JSON schema.
 * Like:
 *
 *   {
 *     "type": "Number",
 *     "minimum": 0
 *   }
 *
 *
 * @class SchemaProperty
 */
export type SchemaProperty = {

  /**
   * The data type of the described property / attribute
   * @type {JSONSchema4TypeName}
   */
  type: JSONSchema4TypeName;

  /**
   * The minimum value of the described property / attribute.
   * Only applies for type='number'
   * @type {number}
   */
  minimum?: number;

  /**
   * The data type of the described property / attribute#
   * Only applies for type='number'
   * @type {number}
   */
  maximum?: number;
};

/**
 * Type represents the schema of imported geo-data, to have information about available
 * properties and data ranges.
 * Comparable to a DescribeFeatureType response for an OGC WFS.
 * This is modelled as JSON schema:
 *
 *  {
 *    "title": "Person",
 *    "type": "object",
 *    "properties": {
 *      "firstName": {
 *        "type": "string"
 *      },
 *      "lastName": {
 *        "type": "string"
 *      },
 *      "age": {
 *        "description": "Age in years",
 *        "type": "integer",
 *        "minimum": 0
 *      }
 *   }
 * }
 *
 * @type DataSchema
 */
export type DataSchema = {

  /**
   * Optional title for the described entity
   *
   * @type {string}
   */
  title?: string;

  /**
   * Type definition for the described entity
   *
   * @type {string}
   */
  type: string;

  /**
   * Properties object describing the attributes of the described entity
   *
   * @type {[name: string]: SchemaProperty; }}
   */
  properties: { [name: string]: SchemaProperty };
};

/**
 * Type represents the schema of imported raster-data,
 * to have information about a single band.
 *
 * @type BandSchema
 */
export type BandSchema = {
  minValue?: number;
  maxValue?: number;
  [key: string]: any;
};

/**
 * BaseData object
 */
export interface BaseData {
  /**
   * Schema of imported geo-data describing the properties / attributes
   *
   * @type {DataSchema}
   */
  schema: DataSchema;
}

/**
 * Internal data object for imported vector geo data.
 * Aggregates a data schema and some example data (FeatureCollection).
 */
export interface VectorData extends BaseData {
  /**
   * Example features of imported geo-data
   */
  exampleFeatures: FeatureCollection<Geometry>;
}

/**
 * Internal data object for imported raster data.
 * Aggregates a data schema and some example data.
 */
export interface RasterData extends BaseData {
  /**
   * Info on imported raster bands.
   * Each band should be a unique key with arbitrary subproperties.
   * These can include projections, statistics and other information.
   */
  rasterBandInfo: {[bandname: string]: BandSchema }
}

/**
 * Internal data object for imported geo data.
 */
export type Data = RasterData | VectorData;

/**
 * Interface, which has to be implemented by all GeoStyler parser classes.
 */
export interface DataParser {
  /**
   * The name of the Parser instance
   */
  title: string;
  /**
   * Optional projection of the input data,
   * e.g. 'EPSG:4326'
   *
   * @type {string}
   */
  sourceProjection?: string;

  /**
   * Optional projection of the output data,
   * e.g. 'EPSG:3857'
   *
   * @type {string}
   */
  targetProjection?: string;

  /**
   * Parses the inputData and transforms it to the GeoStyler data model
   *
   * @param inputData
   */
  readData(inputData: any): Promise<Data>;
}
