import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Header from "./Components/Header";
import "./App.css";
import _ from "lodash";
import Loader from "./Components/Loader";
import ImageModal from "./Components/ImageModal";

const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [pastQueries, setPastQueries] = useState(
    !localStorage.getItem("search")
      ? []
      : JSON.parse(localStorage.getItem("search"))
  );
  const [isSearchTracking, setIsSearchTracking] = useState(false);
  const [showPastQ, setShowPastQ] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const observer = useRef();

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const api_key = "3409534c9191d716c11c908f6c2ccdf0";

  const getPhotos = async () => {
    setLoading(true);
    await axios({
      url: `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${api_key}&per_page=40&page=${page}&format=json&nojsoncallback=1`,
    })
      .then((res) => {
        setLoading(false);
        let newArr = [];
        if (page === 1) {
          newArr = _.uniqBy([...res.data.photos.photo], "id");
        } else {
          newArr = _.uniqBy([...images, ...res.data.photos.photo], "id");
        }
        setHasMore(res.data.photos.page < res.data.photos.pages);
        // setHasMore(res.data.photos.pages !== res.data.photos.page);
        setImages(newArr);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getSearchPhotos = async (text) => {
    setLoading(true);
    await axios({
      url: `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&text=${text}&content_type=json&per_page=20&page=${page}&format=json&nojsoncallback=1`,
    })
      .then((res) => {
        setLoading(false);
        let newArr = [];
        if (page === 1) {
          newArr = _.uniqBy([...res.data.photos.photo], "id");
        } else {
          newArr = _.uniqBy([...images, ...res.data.photos.photo], "id");
        }
        setHasMore(res.data.photos.page < res.data.photos.pages);
        setImages(newArr);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearchClick = () => {
    setIsSearchTracking(true);
    setImages([]);
    setPage(0);
    setHasMore(false);
    if (query) {
      const pastData = !localStorage.getItem("search")
        ? []
        : JSON.parse(localStorage.getItem("search"));
      if (!pastData.includes(query)) {
        const newArr = [...pastData, query];
        localStorage.setItem("search", JSON.stringify(newArr));
        setPastQueries(newArr);
      }
      // localStorage.setItem()
      getSearchPhotos(query);
    } else {
      getPhotos();
      setIsSearchTracking(false);
    }
  };

  const clearAllPostQuery = () => {
    localStorage.removeItem("search");
    setPastQueries([]);
  };

  const clearPastQuery = (i) => {
    const data = JSON.parse(localStorage.getItem("search"));
    const newArr = data.filter((item, index) => index !== i);
    localStorage.setItem("search", JSON.stringify(newArr));
    setPastQueries(newArr);
  };

  useEffect(() => {
    if (isSearchTracking) {
      getSearchPhotos(query);
    } else {
      getPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="App" onClick={() => setShowPastQ(false)}>
      <Header
        query={query}
        setQuery={setQuery}
        handleSearchClick={handleSearchClick}
        pastQueries={pastQueries}
        clearAllPostQuery={clearAllPostQuery}
        showPastQ={showPastQ}
        setShowPastQ={setShowPastQ}
        clearPastQuery={clearPastQuery}
      />
      <div className="images_container_root">
        <div className="row">
          {images &&
            images.length > 0 &&
            images.map((image, i) => {
              if (images.length === i + 1) {
                return (
                  <div
                    className="col-lg-4 col-md-4 col-sm-6 col-12 mb-24 abc"
                    key={image.id}
                    ref={lastImageRef}
                  >
                    <div
                      className="img-container"
                      onClick={() =>
                        handleOpen(
                          `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`
                        )
                      }
                    >
                      <img
                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
                        alt="ficker"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className="col-lg-4 col-md-4 col-sm-6 col-12 mb-24"
                    key={image.id}
                  >
                    <div
                      className="img-container"
                      onClick={() =>
                        handleOpen(
                          `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`
                        )
                      }
                    >
                      <img
                        src={`https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
                        alt="ficker"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                );
              }
            })}
        </div>
        {!loading && images && images.length <= 0 && <h1>No results found</h1>}
        {loading && <Loader />}
      </div>
      <ImageModal open={open} setOpen={setOpen} image={selectedImage} />
    </div>
  );
};

export default App;
