import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => {

    let [loading, setLoading] = useState(true);

    return (
        <div className="loader">
            <div className="sweet-loading text-center">
                <BeatLoader
                    color="#000"
                    loading={loading}
                    css=""
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
};

export default Loader;
