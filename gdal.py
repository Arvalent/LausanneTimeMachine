import shapefile
from osgeo import osr, gdal
import pickle
import numpy as np

shp  =open("data/vec_new/buildings_fixed.shp", "rb")
dbf = open("data/vec_new/buildings_fixed.dbf", "rb")
sf = shapefile.Reader(shp=shp, dbf=dbf)

shp  =open("data/parcelles/num_parcelles_corrected.shp", "rb")
dbf = open("data/parcelles/num_parcelles_corrected.dbf", "rb")
parcelles = shapefile.Reader(shp=shp, dbf=dbf)

print(parcelles.records()[0])



CH1903p_wkt = """ PROJCS["CH1903+ / LV95",
    GEOGCS["CH1903+",
        DATUM["CH1903+",
            SPHEROID["Bessel 1841",6377397.155,299.1528128,
                AUTHORITY["EPSG","7004"]],
            AUTHORITY["EPSG","6150"]],
        PRIMEM["Greenwich",0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.0174532925199433,
            AUTHORITY["EPSG","9122"]],
        AUTHORITY["EPSG","4150"]],
            PROJECTION["Hotine_Oblique_Mercator_Azimuth_Center"],
            PARAMETER["latitude_of_center",46.9524055555556],
            PARAMETER["longitude_of_center",7.43958333333333],
            PARAMETER["azimuth",90],PARAMETER["rectified_grid_angle",90],
            PARAMETER["scale_factor",1],PARAMETER["false_easting",2600000],
            PARAMETER["false_northing",1200000],UNIT["metre",1,
        AUTHORITY["EPSG","9001"]],
            AXIS["Easting",EAST],
            AXIS["Northing",NORTH],
        AUTHORITY["EPSG","2056"]]"""

old_cs = osr.SpatialReference()
old_cs.ImportFromWkt(CH1903p_wkt)

wgs84_wkt = """
    GEOGCS["WGS 84",
        DATUM["WGS_1984",
            SPHEROID["WGS 84",6378137,298.257223563,
                AUTHORITY["EPSG","7030"]],
            AUTHORITY["EPSG","6326"]],
        PRIMEM["Greenwich",0,
            AUTHORITY["EPSG","8901"]],
        UNIT["degree",0.01745329251994328,
            AUTHORITY["EPSG","9122"]],
        AUTHORITY["EPSG","4326"]]"""


new_cs = osr.SpatialReference()
new_cs.ImportFromWkt(wgs84_wkt)
transform = osr.CoordinateTransformation(old_cs, new_cs)

wgs_geometry = list()
for s in sf.iterShapes():
    try:
        wgs_geometry.append(np.array([transform.TransformPoint(point[0], point[1]) for point in s.__geo_interface__["coordinates"][0][0]])[:, :2])
    except:
        wgs_geometry.append(np.array([transform.TransformPoint(point[0], point[1]) for point in s.__geo_interface__["coordinates"][0]])[:, :2])

        
with open("transformed_geometry.pickle", "wb") as handle:
    pickle.dump(wgs_geometry, handle, protocol=pickle.HIGHEST_PROTOCOL)


